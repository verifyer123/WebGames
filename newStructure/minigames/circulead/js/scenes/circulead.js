//Variables globales obligatorias
var soundsPath = "../../shared/minigames/sounds/"       //Referencia a sonidos

// Llamar a la clase como el nombre del minijuego
var circulead = function(){

    //Arreglo obligatoria de idiomas
    var localizationData = {
        "EN":{
            "howTo":"How to Play?",
            "moves":"Moves left"
        },

        "ES":{
            "howTo":"¿Cómo jugar?",
            "moves":"Movimientos extra"
        }
    }

    //Arreglo oblicatorio que contiene atlas, imagenes, sonidos y spines necesarios para el juego y que no son globales
    var assets = {
        atlases: [
            {
                name: "atlas.circulead",
                json: "images/circulead/atlas.json",
                image: "images/circulead/atlas.png"
            }
        ],
        images: [
            {   name:"bground",
                file: "images/circulead/degradado.png"},
            {   name:'tutorial_image',
                file:"images/circulead/tutorial_image_%input.png"},
            {   name:"dononBack",
                file: "images/circulead/donon2.png"},
            {   name:'dononFront',
                file:"images/circulead/donon1.png"},
            {   name:"pizzon",
                file: "images/circulead/pizzon.png"}
        ],
        sounds: [
            {   name: "pop",
                file: soundsPath + "pop.mp3"},
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "flip",
                file: soundsPath + "flipCard.mp3"},
            {   name: "wrong",
                file: soundsPath + "wrongAnswer.mp3"},
            {   name: "right",
                file: soundsPath + "rightChoice.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name:"circuleadSong",
                file: soundsPath + 'songs/sillyAdventureGameLoop.mp3'}
        ],
        spritesheets:[
            {   name: "coin",
               file: "images/circulead/coin.png",
               width: 122,
               height: 123,
               frames: 12
           }
        ],
        spines:[
            {
                name:"yogotar",
                file:"images/spine/estrella/estrella.json"
            },{
                name:"smoke",
                file:"images/spine/smoke/smoke.json"
            }
        ]
    }

    // Constantes opcionales del juego
    var NUM_LIFES = 3;                  //Total de vidas
    var XRELATION = 0.7;                //Relacion de colocacion para x al mover el angulo de popote
    var YRELATION = 0.3;                //Relacion de colocacion para y al mover el angulo del popote
    var STRAWHEIGHT = 48;               //Altura del popote para calculos de posicionamiento
    var STRAWHEIGHTHITBOX = 20;         //Altura a disminuir para choque
    var STATEDURATION = 6;              //Numero de spawn de duracion por cada modalidad de juego
    //Fin de constantes del juego

    //Variables obligatorias dentro del juego
    var gameIndex = 222;                //Identificasdor de juego
    var lives;                          //Conteo de vidas
    var sceneGroup = null;              //Grupo padre de toda la escena
    var tutoGroup;                      //Referencia del grupo tutorial en popup
    var heartsGroup = null;             //Referencia al grupo para vidas
    var pointsBar;                      //Referencia de la barra de monedas
    var coin;                           //Referencia de monedas a poner
    // Fin variables obligatorias dentro del juego

    // Variables opcionales dentro del juego
    var gameState;                      //Delegado para cambio de estado en el juego
    var particleCorrect;                //Referencia a particula de correcto
    var particleWrong;                  //Referencia a particula de incorrecto
    var playerYogotar;                  //Referencia al jugador
    var smokeYogotarSpine;              //Humo para desaparecer nave del yogotar
    var cloudScenary;                   //Nubes de abajo del escenario
    var roadGroup;                      //Grupo que contiene el camino a recorrer
    var powerUpGroup;                   //Grupo que identifica los powerUps
    var backDonut;                      //Pedazo de dona detras
    var frontDonu;                      //Pedazo de dona delante
    var backPizza;                      //Pizza voladora detras de personaje
    var stopHitUp;                      //Variable para indicarle que debe dejar de moverse hacia abajo
    var stopHitDown;                    //Variable para indicarle que debe dejar de moverse hacia arriba
    var nextJump;                       //Contador de espera para el siguiente salto
    var nextMissPoint;                  //Contador de espera para quitar puntos si colisiona
    var text;                           //Texto que indica el tipo de juego
    var namesText;                      //Refernecia de contenido de titulos de juego
    var keyText;                        //Identificador de idioma
    var listRow;                        //Lista de elementos spaneados
    var lastIndex;                      //Contador de elementos
    var gameMode;                       //Indica la modalidad de juego actual para hacer spawner (0: Dona, 1: Pizza)
    var typeSpawn;                      //Ultimo tipo de spawn (arriba o abajo)
    var counterSpawnChangeMode;         //Contador de elementos para realizar switch de modo de juego
    var destroyerStraw;                 //Referencia al objeto que se encarga de destruir los objetos
    var changeMode;                     //Booleano que indica si se cambio de modo
    var spaceSpawn;                     //Indicador de espacio entre popotes dobles
    // Fin variables opcionales dentro del juego
    

    //////////////////////////
    ////// Flujos obligatorios
    //////////////////////////

    //Funcion para cargar sonidos obligatoria
    function loadSounds(){
        sound.decode(assets.sounds)
    }

    //Funcion para inicializar variables necesarias y no vayan con basura (tipo init)
    function initialize(){

        game.stage.backgroundColor = "#ffffff";      //Poner siempre un background
        lives = NUM_LIFES;
        stopHitUp = false;
        stopHitDown = false;
        nextJump = 0;
        nextMissPoint = 0;
        namesText = [];
        namesText["ES"] = ["Circunferencia","Círculo"];
        namesText["EN"] = ["Circumference","Circle"];
        keyText = localization.getLanguage();
        listRow = [];
        lastIndex = -1;
        gameMode = 0;
        counterSpawnChangeMode = 0;
        changeMode = false;

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        loadSounds();                               //Cargar siempre los sonidos

    }

    //Funcion preload
    function preload(){

        game.stage.disableVisibilityChange = false;

    }

    //Funcion que detiene el juego y cosas necesarias
    function stopGame(win){

        sound.stop("circuleadSong")

        //Parte obligatoria
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 3000)
        tweenScene.onComplete.add(function(){

            var resultScreen = sceneloader.getScene("result")
            resultScreen.setScore(true, pointsBar.number, gameIndex)
            sceneloader.show("result")
            sound.play("gameLose")
        })
        //Fin parte obligatoria
    }

    //Funcion obligatoria para creacion de tutorial
    function createTutorial(){

        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

    }

    //Callback de tutorial
    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height;

        game.time.events.add(Phaser.Timer.SECOND, startGame, this);
    }

    //Funcion update
    function update() {

        if(gameState!=null){
            gameState();
        }

    }

    // Fin flujos obligatorios

    //////////////////////////
    ////// Puntos y monedas
    //////////////////////////

    // Oblicatoria : Crea la estructura de las monedas y puntos 
    function createPointsBar(){

        pointsBar = game.add.group();
        pointsBar.x = game.world.width;
        pointsBar.y = 0;
        sceneGroup.add(pointsBar);

        var pointsImg = pointsBar.create(-10,10,'atlas.circulead','xpcoins');
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

    //Obligatoria : Agrega puntos a las monedas
    function addPoint(number){

        sound.play("magic");
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number);

        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true);
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true);
        })

        addNumberPart(pointsBar.text,'+' + number);
    }

    //Agrega una animacion de donde sale un objeto una moneda hasta la barra
    function addCoin(obj){
       coin.x = obj.centerX;
       coin.y = obj.centerY;
       var time = 300;

       game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true);
       
       game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
          game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
              game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                  addPoint(1);
              });
          });
       });
   }

   //Crea la moneda
    function createCoin(){
      coin = game.add.sprite(0, 0, "coin");
      coin.anchor.setTo(0.5);
      coin.scale.setTo(0.8);
      coin.animations.add('coin');
      coin.animations.play('coin', 24, true);
      coin.alpha = 0;
   }

    //Obligatoria : Agrega el numero de puntos con animacion para vidas o monedas
    function addNumberPart(obj,number){

        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)

        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,null,true,500)

        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

    }

    // Fin puntos y monedas

    //////////////////////////
    ////// Vidas
    //////////////////////////

    //Obligatoria : Crea la estructura de corazones
    function createHearts(){

        heartsGroup = game.add.group();
        heartsGroup.y = 10;
        sceneGroup.add(heartsGroup);

        var pivotX = 10;
        var group = game.add.group();
        group.x = pivotX;
        heartsGroup.add(group);

        var heartImg = group.create(0,0,'atlas.circulead','life_box');

        pivotX+= heartImg.width * 0.45;

        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle);
        pointsText.x = pivotX;
        pointsText.y = heartImg.height * 0.15;
        pointsText.setText('X ' + lives);
        heartsGroup.add(pointsText);

        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

        heartsGroup.text = pointsText;

    }

    //Funcion para quitar puntos
    function missPoint(){

        sound.play("wrong");

        lives--;
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

    // Fin vidas

    //////////////////////////
    ////// Flujos opcionales helper
    //////////////////////////

    //Funcion para cargar el spine (opcional)
    function createSpine() {
        playerYogotar = game.add.group();
        playerYogotar.name = "YogotarGroup";
        playerYogotar.position.setTo(backDonut.body.x + 100,backDonut.body.y  + 80);
        playerYogotar.scale.setTo(0.8,0.8);
        sceneGroup.add(playerYogotar);

        var playerYogotarSpine = game.add.spine(0,0,"yogotar");
        playerYogotarSpine.x = 0;
        playerYogotarSpine.y = 0;
        playerYogotarSpine.scale.setTo(0.65,0.65);
        playerYogotarSpine.setSkinByName("normal");
        playerYogotarSpine.setAnimationByName(0,"idle_donut", true);
        playerYogotar.add(playerYogotarSpine);
        playerYogotar.spineRef = playerYogotarSpine;
        
        playerYogotar.setAnimation = function (animations, loop) {
            if(animations.length > 1){
                for(var index = 0; index < animations.length; index++) {
                    var animation = animations[index];
                    if (index == 0){
                        playerYogotarSpine.setAnimationByName(0, animation, loop);
                    }
                    else{
                        playerYogotarSpine.addAnimationByName(0, animation, loop);
                    }
                }
            }else{
                playerYogotarSpine.setAnimationByName(0, animations[0], loop);
            }
        }

        smokeYogotarSpine = game.add.spine(0,0,"smoke");
        smokeYogotarSpine.x = 0;
        smokeYogotarSpine.y = 0;
        smokeYogotarSpine.scale.setTo(1,1);
        smokeYogotarSpine.setSkinByName("normal");
        playerYogotar.add(smokeYogotarSpine);

        
    }

    //Crea particulas
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.circulead',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle;
    }

    // Flujos opcionales helper

    //////////////////////////
    ////// Flujos propios del juego
    //////////////////////////

    //Funcion para crear todo el fondo y escenario de la escena
    function createScenary(){

        var backgroundScenary = game.add.tileSprite(0,0,game.width, game.height*0.9,'atlas.circulead','tilleFondo');
        sceneGroup.add(backgroundScenary);

        var frontgroundScenary = game.add.tileSprite(0,0,game.width, game.height*0.9,'bground');
        frontgroundScenary.alpha = 0.8;
        sceneGroup.add(frontgroundScenary);

        cloudScenary = game.add.tileSprite(0,game.height-169,game.width,169,'atlas.circulead','tileNube');
        sceneGroup.add(cloudScenary);

    }

    //Crea el transporte del personaje
    function createCarrier(){

        game.physics.startSystem(Phaser.Physics.P2JS);

        backDonut = game.add.sprite(80,0,'dononBack');
        backDonut.scale.setTo(0.95,0.95);
        game.physics.p2.enable([backDonut], false);
        backDonut.anchor.setTo(0,0);
        backDonut.body.clearShapes();
        backDonut.body.addRectangle(10, 10, backDonut.width/2, 100);
        backDonut.body.fixedRotation = true;
        backDonut.body.active = true;
        sceneGroup.add(backDonut);
        
        roadGroup = game.add.group();
        sceneGroup.add(roadGroup);

        frontDonut = game.add.sprite(80,0,'dononFront');
        frontDonut.scale.setTo(0.95,0.95);
        game.physics.p2.enable([frontDonut], false);
        frontDonut.anchor.setTo(0,0);
        frontDonut.body.clearShapes();
        frontDonut.body.addRectangle(10, 10, frontDonut.width/2, frontDonut.height/2 + 100);
        frontDonut.body.fixedRotation = true;
        frontDonut.body.active = true;
        sceneGroup.add(frontDonut);

        backPizza = game.add.sprite(80,-500,'pizzon');
        backPizza.scale.setTo(0.95,0.95);
        game.physics.p2.enable([backPizza], false);
        backPizza.anchor.setTo(0,0);
        backPizza.body.clearShapes();
        backPizza.body.addCircle(backPizza.width/2 + 10, backPizza.width/2, backPizza.height/2);
        backPizza.body.fixedRotation = true;
        backPizza.body.kinematic = true;
        backPizza.body.active = false;
        sceneGroup.add(backPizza);

        destroyerStraw = game.add.sprite(-820,0,'bground');
        sceneGroup.add(destroyerStraw);

        backDonut.body.onBeginContact.add(blockHitUp, this);
        frontDonut.body.onBeginContact.add(blockHitDown, this);
        backPizza.body.onBeginContact.add(pizzaCollision,this);

        powerUpGroup = game.add.group();
        sceneGroup.add(powerUpGroup);

        var titleBar = game.add.tileSprite(0,0,360, 118,'atlas.circulead','barra');
        titleBar.anchor.setTo(0.5,0.5);
        titleBar.position.setTo((game.width*0.5),120);
        titleBar.scale.setTo(0.9,0.9);
        sceneGroup.add(titleBar);

        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        text = game.add.text(0,0, namesText[keyText][0], style);
        text.anchor.setTo(0.5,0.5);
        text.position.setTo((game.width*0.5),120);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        sceneGroup.add(text);

        for (var i = 0; i < 5; i++) {
            spawner();
        }
    }

    //Funcion de colicion para punto de arriba de dona
    function blockHitUp (body, bodyB, shapeA, shapeB, equation) {
        if (body && backDonut.body.active){
            if(body.name == "poweruppizza"){
                addPoint(1);
                destroyPowerUp(body);
                playAnimation(1);
                backDonut.body.kinematic = true;
                frontDonut.body.kinematic = true;
                powerUpGroup.forEach(function(entry){
                    if(entry.body != null){
                        entry.body.setZeroVelocity();
                        entry.body.moveRight(-9000);
                    }
                });
                roadGroup.forEach(function(entry){
                    if(entry.body != null){
                        entry.body.setZeroVelocity();
                        entry.body.moveRight(-9000);
                    }
                });
                backPizza.body.y = backDonut.body.y - 80;
                backDonut.body.y = -500;
                frontDonut.body.y = -500;
                backDonut.body.setZeroVelocity();
                frontDonut.body.setZeroVelocity();
                backDonut.body.active = false;
                frontDonut.body.active = false;
                backPizza.body.static = false;
                backPizza.body.sprite.alpha = 1;
                backDonut.body.sprite.alpha = 0;
                frontDonut.body.sprite.alpha = 0;
                text.setText(namesText[keyText][1]);
                backPizza.body.active = true;
                gameState = createDelegate(gamePlayPizza);
            }else if(body.name == "straw"){
                stopHitUp = true;
                backDonut.body.setZeroVelocity();
                frontDonut.body.setZeroVelocity();
                backDonut.body.kinematic = true;
                frontDonut.body.kinematic = true;
                roadGroup.forEach(function(entry){
                if(entry.body != null){
                    entry.body.setZeroVelocity();
                }
                });
                powerUpGroup.forEach(function(entry){
                if(entry.body != null){
                    entry.body.setZeroVelocity();
                }
                });
                missPointBlock(false);
            }
        }
    }

    //Funcion de colicion para punto de abajo de dona
    function blockHitDown (body, bodyB, shapeA, shapeB, equation) {
        if (body  && frontDonut.body.active && body.name=="straw"){
            stopHitDown = true;
            backDonut.body.setZeroVelocity();
            frontDonut.body.setZeroVelocity();
            backDonut.body.kinematic = true;
            frontDonut.body.kinematic = true;
            roadGroup.forEach(function(entry){
            if(entry.body != null){
                entry.body.setZeroVelocity();
            }
            });
            powerUpGroup.forEach(function(entry){
            if(entry.body != null){
                entry.body.setZeroVelocity();
            }
            });
            missPointBlock(false);
            game.time.events.add(500, resetBodyDown, this);
        }
    }

    //Colision de pizza
    function pizzaCollision(body, bodyB, shapeA, shapeB, equation) {
        if (body && backPizza.body.active){
            if(body.name == "powerupdona"){
                addPoint(1);
                var newPosYPowerUp = body.y - 50;
                destroyPowerUp(body);
                playAnimation(0);
                backDonut.body.x = backPizza.body.x;
                frontDonut.body.x = backPizza.body.x;
                powerUpGroup.forEach(function(entry){
                    if(entry.body != null){
                        entry.body.setZeroVelocity();
                        entry.body.moveRight(-9000);
                    }
                });
                roadGroup.forEach(function(entry){
                    if(entry.body != null){
                        entry.body.setZeroVelocity();
                        entry.body.moveRight(-9000);
                    }
                });
                backDonut.body.y = newPosYPowerUp;
                frontDonut.body.y = newPosYPowerUp;
                backPizza.body.kinematic = true;
                backPizza.body.active = false;
                backPizza.body.y = -500;
                backPizza.body.setZeroVelocity();
                backDonut.body.static = false;
                frontDonut.body.static = false;
                backDonut.body.sprite.alpha = 1;
                frontDonut.body.sprite.alpha = 1;
                backPizza.body.sprite.alpha = 0;
                text.setText(namesText[keyText][0]);
                backDonut.body.active = true;
                frontDonut.body.active = true;
                gameState = createDelegate(gamePlayDonut);
            }else if(body.name=="strawD" || body.name=="strawU"){
                if(body.name=="strawD"){
                    stopHitUp = true;
                }
                else if(body.name=="strawU"){
                    stopHitDown = true;
                    game.time.events.add(800, resetBodyDownP, this);
                }
                backPizza.body.setZeroVelocity();
                backPizza.body.kinematic = true;
                roadGroup.forEach(function(entry){
                if(entry.body != null){
                    entry.body.setZeroVelocity();
                }
                });
                powerUpGroup.forEach(function(entry){
                if(entry.body != null){
                    entry.body.setZeroVelocity();
                }
                });
                missPointBlock(true);
            }
        }
    }

    //Auxiliar para quitar power up
    function destroyPowerUp(bodyPowerUp){
        bodyPowerUp.sprite.kill();
        bodyPowerUp.destroy();
        smokeYogotarSpine.setAnimationByName(0,"transform", false);
    }

    //Funcion para sacar nuevo x
    function newPosX(posxStraw, widthStraw){
        return posxStraw + (widthStraw * XRELATION);
    }

    //Funcion para sacar nuevo y de arriba
    function newPosYUp(posyStraw, widthStraw,heightStraw){
        return posyStraw - ((widthStraw*XRELATION) + (heightStraw * YRELATION));
    }

    //Funcion para sacar nuevo y de abajo
    function newPosYDown(posyStraw, widthStraw,heightStraw){
        return (posyStraw-heightStraw) + (widthStraw*XRELATION) + (heightStraw * YRELATION);
    }

    //Funcion para crear un delegado
    function createDelegate(func) {
        return function() { 
            return func.apply(arguments);
        };
    }

    //Funcion para hacer coliciones sin fisica
    function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

    }

    //Funcion para inicar el juego
    function startGame(){
        gameState = createDelegate(gamePlayDonut); 
        doSpwaner();
    }

    //Funcion para spawnear cada cierto tiempo
    function doSpwaner(){
        spawner();
        game.time.events.add(Phaser.Timer.SECOND*2, doSpwaner, this);
    }

    //Funcion para realizar el estado de pausa
    function gamePlayWait(){}

    //Gameplay referido al nivel de donas
    function gamePlayDonut(){
        frontDonut.body.y = backDonut.body.y;
        playerYogotar.position.setTo(backDonut.body.x + 100,backDonut.body.y  + 80);
        checkDestroyStraw();
        if(!stopHitUp && !stopHitDown){
            scenaryMovement();
            backDonut.body.setZeroVelocity();
            frontDonut.body.setZeroVelocity();
            backDonut.body.moveDown(60);
        }
        if(game.input.activePointer.leftButton.isDown && !stopHitDown){
            jump();
        }
    }

    //Gameplay referido al nivel de pizza
    function gamePlayPizza(){
        playerYogotar.position.setTo(backPizza.body.x + 160,backPizza.body.y  + 260);
        checkDestroyStraw();
        if(!stopHitUp && !stopHitDown){
            scenaryMovement();
            backPizza.body.setZeroVelocity();
            backPizza.body.moveDown(60);
        }
        if(game.input.activePointer.leftButton.isDown && !stopHitDown){
            leap();
        }
    }

    //Funcion para quitar popotes ya no usados
    function checkDestroyStraw(){
        roadGroup.forEach(function(entry){
            if (entry.body && (entry.body.name=="straw" || entry.body.name=="strawD" || entry.body.name=="strawU") && checkOverlap(entry,destroyerStraw) && !entry.collide){
                entry.collide = true;
                entry.body.destroy();
                entry.kill();
                listRow.shift();
                lastIndex--;
            }
        });
    }

    //Funcion para realizar un bloqueo para el salto
    function missPointBlock(pizza){
        if (game.time.now > nextMissPoint){
            if(lives > 1){
                if(pizza){
                    playAnimation(3);
                }else{
                    playAnimation(2); 
               }
            }else{
                if(pizza){
                    playAnimation(5);
                }else{
                    playAnimation(4); 
               }
            }
            missPoint();
            nextMissPoint = game.time.now + 1500;
        }
    }

    //Funcion para realiza salto de dona
    function jump(){
        if (game.time.now > nextJump){
            stopHitUp = false;
            backDonut.body.setZeroVelocity();
            frontDonut.body.setZeroVelocity();
            backDonut.body.moveUp(2000);
            frontDonut.body.moveUp(2000);
            backDonut.body.kinematic = false;
            frontDonut.body.kinematic = false;
            game.time.events.add(500, resetBody, this);
            nextJump = game.time.now + 250;
        }
    }

    //Salto que realiza la pizza
    function leap(){
        if (game.time.now > nextJump){
            stopHitUp = false;
            backPizza.body.setZeroVelocity();
            backPizza.body.moveUp(2000);
            backPizza.body.kinematic = false;
            game.time.events.add(500, resetBodyP, this);
            nextJump = game.time.now + 250;
        }
    }

    //Desbloqueo para pizza
    function resetBodyDownP(){
        stopHitDown = false;
        resetBodyP();
    }

    //Regresa el cuerpo a dynamic para pizza
    function resetBodyP(){
        backPizza.body.static = false;
    }

    //Desbloqueo de dona cuando colisiono por abajo
    function resetBodyDown(){
        stopHitDown = false;
        resetBody();
    }

    //Regresa el cuerpo a dynamic para dona
    function resetBody(){
        backDonut.body.static = false;
        frontDonut.body.static = false;
    }

    //Funcion de movimiento del escenario
    function scenaryMovement(){
        cloudScenary.tilePosition.x -= 1;
        backDonut.body.setZeroVelocity();
        frontDonut.body.setZeroVelocity();
        backDonut.body.moveRight(-60);
        powerUpGroup.forEach(function(entry){
            if(entry.body != null){
                entry.body.setZeroVelocity();
                entry.body.moveRight(-60);
            }
        });
        roadGroup.forEach(function(entry){
            if(entry.body != null){
                entry.body.setZeroVelocity();
                entry.body.moveRight(-60);
            }
        });
    }

    //Funcion de animaciones basicas
    function playAnimation(id){
        switch(id){
            case 0:
                playerYogotar.setAnimation(["idle_donut"],true);
                break;
            case 1:
                playerYogotar.setAnimation(["idle_pizza"],true);
                break;
            case 2:
                playerYogotar.setAnimation(["hit_donut","idle_donut"],true);
                break;
            case 3:
                playerYogotar.setAnimation(["hit_pizza","idle_pizza"], true);
                break;
            case 4:
                gameState = createDelegate(gamePlayWait);
                playerYogotar.setAnimation(["lose_donut"], false);
                break;
            case 5:
                gameState = createDelegate(gamePlayWait);
                playerYogotar.setAnimation(["lose_pizza"], false);
                break;
        }
        playerYogotar.spineRef.setToSetupPose();
    }

    //Realizar spawner para dona y pizza
    function spawner(){
        if(counterSpawnChangeMode == STATEDURATION){
            counterSpawnChangeMode = 0;
            gameMode = (gameMode == 0)? 1 : 0;
        }
        if(gameMode == 0){
            var newWidthStraw = (lastIndex==-1)? 500 : getRandomInt(20, 400);
            var newPosYStraw;
            if(lastIndex==-1){
                newPosYStraw = getRandomInt(620,650);
            }else if(changeMode == true){
                newPosYStraw = listRow[lastIndex].y - 200;
            }else{
                newPosYStraw = listRow[lastIndex].y;
            }
            var newPosXStaw = (lastIndex==-1)? 0 : listRow[lastIndex].x+listRow[lastIndex].width;
            changeMode = false;

            if(counterSpawnChangeMode < (STATEDURATION - 1)){

                typeSpawn = (lastIndex==-1)? getRandomInt(0, 1) : ((typeSpawn == 0)? 1 : 0);

                var horizontal = game.add.tileSprite(newPosXStaw,newPosYStraw,newWidthStraw,STRAWHEIGHT,'atlas.circulead','tilePopote');
                game.physics.p2.enable([horizontal], false);
                horizontal.anchor.setTo(0,0);
                horizontal.body.name = "straw";
                horizontal.body.clearShapes();
                horizontal.body.addRectangle(horizontal.width, horizontal.height, horizontal.width/2, horizontal.height/2);
                horizontal.body.kinematic = true;
                roadGroup.add(horizontal);
                listRow.push(horizontal);
                if(lastIndex == -1){
                    backDonut.body.y = newPosYStraw - (backDonut.height/2);
                    frontDonut.body.y = backDonut.body.y;
                }
                lastIndex++;

                if(typeSpawn == 0){
                    var up = game.add.sprite(listRow[lastIndex].x+listRow[lastIndex].width,listRow[lastIndex].y,'atlas.circulead','45_1');
                    game.physics.p2.enable([up], false);
                    up.anchor.setTo(0,0);
                    up.body.name = "straw";
                    up.body.clearShapes();
                    up.body.addRectangle(up.width, up.height, up.width/2, up.height/2);
                    up.body.kinematic = true;
                    roadGroup.add(up);
                    listRow.push(up);
                    lastIndex++;

                    newWidthStraw = getRandomInt(20,80);
                    var vertical = game.add.tileSprite(listRow[lastIndex].x,listRow[lastIndex].y,newWidthStraw,STRAWHEIGHT,'atlas.circulead','tilePopote');
                    game.physics.p2.enable([vertical], false);
                    vertical.anchor.setTo(0,0);
                    vertical.body.name = "straw";
                    vertical.body.clearShapes();
                    vertical.body.addRectangle(vertical.width, vertical.height, vertical.width/2, horizontal.height/2);
                    vertical.body.angle = -45;
                    vertical.body.kinematic = true;
                    roadGroup.add(vertical);
                    listRow.push(vertical);
                    lastIndex++;
                    
                    var verhor = game.add.sprite(newPosX(listRow[lastIndex].x,listRow[lastIndex].width),newPosYUp(listRow[lastIndex].y,listRow[lastIndex].width,STRAWHEIGHT),'atlas.circulead','45_2');
                    game.physics.p2.enable([verhor], false);
                    verhor.anchor.setTo(0,0);
                    verhor.body.name = "straw";
                    verhor.body.clearShapes();
                    verhor.body.addRectangle(verhor.width, verhor.height, verhor.width/2, verhor.height/2);
                    verhor.body.kinematic = true;
                    roadGroup.add(verhor);
                    listRow.push(verhor);
                    lastIndex++;
                }else if(typeSpawn == 1){
                    var down = game.add.sprite(listRow[lastIndex].x + listRow[lastIndex].width,listRow[lastIndex].y,'atlas.circulead','45_3');
                    game.physics.p2.enable([down], false);
                    down.anchor.setTo(0,0);
                    down.body.name = "straw";
                    down.body.clearShapes();
                    down.body.addRectangle(down.width, down.height, down.width/2, down.height/2);
                    down.body.kinematic = true;
                    roadGroup.add(down);
                    listRow.push(down);
                    lastIndex++;

                    newWidthStraw = getRandomInt(50,100);
                    var inverse = game.add.tileSprite(listRow[lastIndex].x,listRow[lastIndex].y + listRow[lastIndex].height,newWidthStraw,STRAWHEIGHT,'atlas.circulead','tilePopote');
                    game.physics.p2.enable([inverse], false);
                    inverse.anchor.setTo(0,1);
                    inverse.body.name = "straw";
                    inverse.body.clearShapes();
                    inverse.body.addRectangle(inverse.width, inverse.height, inverse.width/2, -inverse.height/2);
                    inverse.body.angle = 45;
                    inverse.body.kinematic = true;
                    roadGroup.add(inverse);
                    listRow.push(inverse);
                    lastIndex++;

                    var invhor = game.add.sprite(newPosX(listRow[lastIndex].x,listRow[lastIndex].width),newPosYDown(listRow[lastIndex].y,listRow[lastIndex].width,STRAWHEIGHT),'atlas.circulead','45_4');
                    game.physics.p2.enable([invhor], false);
                    invhor.anchor.setTo(0,0);
                    invhor.body.name = "straw";
                    invhor.body.clearShapes();
                    invhor.body.addRectangle(invhor.width, invhor.height, invhor.width/2, invhor.height/2);
                    invhor.body.kinematic = true;
                    roadGroup.add(invhor);
                    listRow.push(invhor);
                    lastIndex++;
                }
            }else{
                var horizontal = game.add.tileSprite(newPosXStaw,newPosYStraw,96,STRAWHEIGHT,'atlas.circulead','popoteEnd');
                game.physics.p2.enable([horizontal], false);
                horizontal.anchor.setTo(0,0);
                horizontal.body.name = "straw";
                horizontal.body.clearShapes();
                horizontal.body.addRectangle(horizontal.width, horizontal.height, horizontal.width/2, horizontal.height/2);
                horizontal.body.kinematic = true;
                roadGroup.add(horizontal);
                listRow.push(horizontal);
                lastIndex++;

                var powerUp = game.add.sprite(newPosXStaw,newPosYStraw - 150,'atlas.circulead','pizza');
                game.physics.p2.enable([powerUp], false);
                powerUp.anchor.setTo(0,0);
                powerUp.body.name = "poweruppizza";
                powerUp.body.clearShapes();
                powerUp.body.addRectangle(powerUp.width, powerUp.height, powerUp.width/2, powerUp.height/2);
                powerUp.body.kinematic = true;
                powerUpGroup.add(powerUp);

                spaceSpawn = getRandomInt(440,500);

                changeMode = true;
            }
        }else if(gameMode == 1){
            var newWidthStraw = (changeMode == true)? 500 : getRandomInt(400, 500);
            var newPosYStraw;
            if(changeMode == true){
                    newPosYStraw = listRow[lastIndex].y - 350;
            }else{
                newPosYStraw = listRow[lastIndex].y - spaceSpawn;
            }
            var newPosXStaw = listRow[lastIndex].x+listRow[lastIndex].width;
            changeMode = false;

            if(counterSpawnChangeMode < (STATEDURATION - 1)){

                typeSpawn = (typeSpawn == 0)? 1 : 0;

                var horizontalUp = game.add.tileSprite(newPosXStaw,newPosYStraw,newWidthStraw,STRAWHEIGHT,'atlas.circulead','tilePopote');
                game.physics.p2.enable([horizontalUp], false);
                horizontalUp.anchor.setTo(0,0);
                horizontalUp.body.name = "strawU";
                horizontalUp.body.clearShapes();
                horizontalUp.body.addRectangle(horizontalUp.width, horizontalUp.height, horizontalUp.width/2, horizontalUp.height/2);
                horizontalUp.body.kinematic = true;
                roadGroup.add(horizontalUp);
                listRow.push(horizontalUp);
                lastIndex++;

                var horizontalDown = game.add.tileSprite(newPosXStaw,newPosYStraw+spaceSpawn,newWidthStraw,STRAWHEIGHT,'atlas.circulead','tilePopote');
                game.physics.p2.enable([horizontalDown], false);
                horizontalDown.anchor.setTo(0,0);
                horizontalDown.body.name = "strawD";
                horizontalDown.body.clearShapes();
                horizontalDown.body.addRectangle(horizontalDown.width, horizontalDown.height, horizontalDown.width/2, horizontalDown.height/2);
                horizontalDown.body.kinematic = true;
                roadGroup.add(horizontalDown);
                listRow.push(horizontalDown);
                lastIndex++;

                if(typeSpawn == 0){
                    var upUp = game.add.sprite(listRow[lastIndex].x+listRow[lastIndex].width,listRow[lastIndex].y-spaceSpawn,'atlas.circulead','45_1');
                    game.physics.p2.enable([upUp], false);
                    upUp.anchor.setTo(0,0);
                    upUp.body.name = "strawU";
                    upUp.body.clearShapes();
                    upUp.body.addRectangle(upUp.width, upUp.height, upUp.width/2, upUp.height/2);
                    upUp.body.kinematic = true;
                    roadGroup.add(upUp);
                    listRow.push(upUp);
                    lastIndex++;

                    var upDown = game.add.sprite(listRow[lastIndex].x,listRow[lastIndex].y+spaceSpawn,'atlas.circulead','45_1');
                    game.physics.p2.enable([upDown], false);
                    upDown.anchor.setTo(0,0);
                    upDown.body.name = "strawD";
                    upDown.body.clearShapes();
                    upDown.body.addRectangle(upDown.width, upDown.height, upDown.width/2, upDown.height/2);
                    upDown.body.kinematic = true;
                    roadGroup.add(upDown);
                    listRow.push(upDown);
                    lastIndex++;

                    newWidthStraw = getRandomInt(20,80);
                    var verticalUp = game.add.tileSprite(listRow[lastIndex].x,listRow[lastIndex].y-spaceSpawn,newWidthStraw,STRAWHEIGHT,'atlas.circulead','tilePopote');
                    game.physics.p2.enable([verticalUp], false);
                    verticalUp.anchor.setTo(0,0);
                    verticalUp.body.name = "strawU";
                    verticalUp.body.clearShapes();
                    verticalUp.body.addRectangle(verticalUp.width, verticalUp.height, verticalUp.width/2, upUp.height/2);
                    verticalUp.body.angle = -45;
                    verticalUp.body.kinematic = true;
                    roadGroup.add(verticalUp);
                    listRow.push(verticalUp);
                    lastIndex++;

                    var verticalDown = game.add.tileSprite(listRow[lastIndex].x,listRow[lastIndex].y+spaceSpawn,newWidthStraw,STRAWHEIGHT,'atlas.circulead','tilePopote');
                    game.physics.p2.enable([verticalDown], false);
                    verticalDown.anchor.setTo(0,0);
                    verticalDown.body.name = "strawD";
                    verticalDown.body.clearShapes();
                    verticalDown.body.addRectangle(verticalDown.width, verticalDown.height, verticalDown.width/2, upDown.height/2);
                    verticalDown.body.angle = -45;
                    verticalDown.body.kinematic = true;
                    roadGroup.add(verticalDown);
                    listRow.push(verticalDown);
                    lastIndex++;
                    
                    var verhorUp = game.add.sprite(newPosX(listRow[lastIndex].x,listRow[lastIndex].width),newPosYUp(listRow[lastIndex].y,listRow[lastIndex].width,STRAWHEIGHT)-spaceSpawn,'atlas.circulead','45_2');
                    game.physics.p2.enable([verhorUp], false);
                    verhorUp.anchor.setTo(0,0);
                    verhorUp.body.name = "strawU";
                    verhorUp.body.clearShapes();
                    verhorUp.body.addRectangle(verhorUp.width, verhorUp.height, verhorUp.width/2, verhorUp.height/2);
                    verhorUp.body.kinematic = true;
                    roadGroup.add(verhorUp);
                    listRow.push(verhorUp);
                    lastIndex++;
                    
                    var verhorDown = game.add.sprite(listRow[lastIndex].x,listRow[lastIndex].y+spaceSpawn,'atlas.circulead','45_2');
                    game.physics.p2.enable([verhorDown], false);
                    verhorDown.anchor.setTo(0,0);
                    verhorDown.body.name = "strawD";
                    verhorDown.body.clearShapes();
                    verhorDown.body.addRectangle(verhorDown.width, verhorDown.height, verhorDown.width/2, verhorDown.height/2);
                    verhorDown.body.kinematic = true;
                    roadGroup.add(verhorDown);
                    listRow.push(verhorDown);
                    lastIndex++;
                }else if(typeSpawn == 1){
                    var downUp = game.add.sprite(listRow[lastIndex].x + listRow[lastIndex].width,listRow[lastIndex].y-spaceSpawn,'atlas.circulead','45_3');
                    game.physics.p2.enable([downUp], false);
                    downUp.anchor.setTo(0,0);
                    downUp.body.name = "strawU";
                    downUp.body.clearShapes();
                    downUp.body.addRectangle(downUp.width, downUp.height, downUp.width/2, downUp.height/2);
                    downUp.body.kinematic = true;
                    roadGroup.add(downUp);
                    listRow.push(downUp);
                    lastIndex++;

                    var downDown = game.add.sprite(listRow[lastIndex].x,listRow[lastIndex].y+spaceSpawn,'atlas.circulead','45_3');
                    game.physics.p2.enable([downDown], false);
                    downDown.anchor.setTo(0,0);
                    downDown.body.name = "strawD";
                    downDown.body.clearShapes();
                    downDown.body.addRectangle(downDown.width, downDown.height, downDown.width/2, downDown.height/2);
                    downDown.body.kinematic = true;
                    roadGroup.add(downDown);
                    listRow.push(downDown);
                    lastIndex++;

                    newWidthStraw = getRandomInt(50,100);
                    var inverseUp = game.add.tileSprite(listRow[lastIndex].x,(listRow[lastIndex].y + listRow[lastIndex].height) - spaceSpawn,newWidthStraw,STRAWHEIGHT,'atlas.circulead','tilePopote');
                    game.physics.p2.enable([inverseUp], false);
                    inverseUp.anchor.setTo(0,1);
                    inverseUp.body.name = "strawU";
                    inverseUp.body.clearShapes();
                    inverseUp.body.addRectangle(inverseUp.width, inverseUp.height, inverseUp.width/2, -inverseUp.height/2);
                    inverseUp.body.angle = 45;
                    inverseUp.body.kinematic = true;
                    roadGroup.add(inverseUp);
                    listRow.push(inverseUp);
                    lastIndex++;

                    var inverseDown = game.add.tileSprite(listRow[lastIndex].x,listRow[lastIndex].y + spaceSpawn,newWidthStraw,STRAWHEIGHT,'atlas.circulead','tilePopote');
                    game.physics.p2.enable([inverseDown], false);
                    inverseDown.anchor.setTo(0,1);
                    inverseDown.body.name = "strawD";
                    inverseDown.body.clearShapes();
                    inverseDown.body.addRectangle(inverseDown.width, inverseDown.height, inverseDown.width/2, -inverseDown.height/2);
                    inverseDown.body.angle = 45;
                    inverseDown.body.kinematic = true;
                    roadGroup.add(inverseDown);
                    listRow.push(inverseDown);
                    lastIndex++;

                    var invhorUp = game.add.sprite(newPosX(listRow[lastIndex].x,listRow[lastIndex].width),newPosYDown(listRow[lastIndex].y,listRow[lastIndex].width,STRAWHEIGHT)-spaceSpawn,'atlas.circulead','45_4');
                    game.physics.p2.enable([invhorUp], false);
                    invhorUp.anchor.setTo(0,0);
                    invhorUp.body.name = "strawU";
                    invhorUp.body.clearShapes();
                    invhorUp.body.addRectangle(invhorUp.width, invhorUp.height, invhorUp.width/2, invhorUp.height/2);
                    invhorUp.body.kinematic = true;
                    roadGroup.add(invhorUp);
                    listRow.push(invhorUp);
                    lastIndex++;

                    var invhorDown = game.add.sprite(listRow[lastIndex].x,listRow[lastIndex].y + spaceSpawn,'atlas.circulead','45_4');
                    game.physics.p2.enable([invhorDown], false);
                    invhorDown.anchor.setTo(0,0);
                    invhorDown.body.name = "strawD";
                    invhorDown.body.clearShapes();
                    invhorDown.body.addRectangle(invhorDown.width, invhorDown.height, invhorDown.width/2, invhorDown.height/2);
                    invhorDown.body.kinematic = true;
                    roadGroup.add(invhorDown);
                    listRow.push(invhorDown);
                    lastIndex++;
                }
            }else{
                var horizontalUp = game.add.tileSprite(newPosXStaw,newPosYStraw,96,STRAWHEIGHT,'atlas.circulead','popoteEnd');
                game.physics.p2.enable([horizontalUp], false);
                horizontalUp.anchor.setTo(0,0);
                horizontalUp.body.name = "strawU";
                horizontalUp.body.clearShapes();
                horizontalUp.body.addRectangle(horizontalUp.width, horizontalUp.height, horizontalUp.width/2, horizontalUp.height/2);
                horizontalUp.body.kinematic = true;
                roadGroup.add(horizontalUp);
                listRow.push(horizontalUp);
                lastIndex++;

                var horizontalDown = game.add.tileSprite(newPosXStaw,newPosYStraw+spaceSpawn,96,STRAWHEIGHT,'atlas.circulead','popoteEnd');
                game.physics.p2.enable([horizontalDown], false);
                horizontalDown.anchor.setTo(0,0);
                horizontalDown.body.name = "strawD";
                horizontalDown.body.clearShapes();
                horizontalDown.body.addRectangle(horizontalDown.width, horizontalDown.height, horizontalDown.width/2, horizontalDown.height/2);
                horizontalDown.body.kinematic = true;
                roadGroup.add(horizontalDown);
                listRow.push(horizontalDown);
                lastIndex++;

                var powerUp = game.add.sprite(newPosXStaw + 60,newPosYStraw + 180,'atlas.circulead','dona');
                game.physics.p2.enable([powerUp], false);
                powerUp.anchor.setTo(0,0);
                powerUp.body.name = "powerupdona";
                powerUp.body.clearShapes();
                powerUp.body.addRectangle(powerUp.width, powerUp.height, powerUp.width/2, powerUp.height/2);
                powerUp.body.kinematic = true;
                powerUpGroup.add(powerUp);

                changeMode = true;
            }
        }
        counterSpawnChangeMode++;
        
    }

    //Funcion para obetener un random range (ambos inclusivos)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // Fin flujos propios del juego

    //Return realiza toda la carga e inicialiacion de todo (contiene la funcion create)
    //Aqui se declaran el preload, update, create y es necesario assets, name y getGameData
    return {
        assets: assets,
        name: "circulead",
        preload:preload,
        update:update,
        getGameData:function () {
            var games = yogomeGames.getGames()
            return games[gameIndex]
        },
        //Funcion create!!!
        create: function(event){

            swipe = new Swipe(game)
            sceneGroup = game.add.group();
            yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);

            initialize();
            var circuleadSong = sound.play("circuleadSong", {loop:true, volume:0.6})

            //Crear en el orden de atras hacia adelante
            createScenary();
            createCarrier();
            createSpine();

            createTutorial();
            createHearts();
            createPointsBar();
            createCoin();

            particleCorrect = createPart('star');
            sceneGroup.add(particleCorrect);

            particleWrong = createPart('wrong');
            sceneGroup.add(particleWrong);

            buttons.getButton(circuleadSong,sceneGroup)
        }
    }
}()