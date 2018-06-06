//Variables globales obligatorias
var soundsPath = "../../shared/minigames/sounds/"       //Referencia a sonidos

// Llamar a la clase como el nombre del minijuego
var h2os = function(){

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
                name: "atlas.h2os",
                json: "images/h2os/atlas.json",
                image: "images/h2os/atlas.png"
            }
        ],
        images: [
            {   name:"bground",
                file: "images/h2os/bGround.png"},
            {   name:'tutorial_image',
                file:"images/h2os/tutorial_image_%input.png"}
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
            {   name:"acornSong",
                file: soundsPath + 'songs/wormwood.mp3'}
        ],
        spritesheets:[
            {   name: "coin",
               file: "images/h2os/coin.png",
               width: 122,
               height: 123,
               frames: 12
           }
        ],
        spines:[
            {
                name:"yogotar",
                file:"images/spine/estrella.json"
            }
        ]
    }

    // Constantes opcionales del juego
    var NUM_LIFES = 1;                 //Total de vidas
    var POSGROUND = [395,569,735];     //Puntos bàsicos de movimiento
    var MAXWATER = 356;                //Total maximo de agua
    var SPACECONOS = 200;              //Repeticion de objeto
    var SPACEDRINK = 500;               //Repeticion de aguas para tutorial
    var TOTALGRADAS = 8;                //Longitud de gradas
    //Fin de constantes del juego

    //Variables obligatorias dentro del juego
    var gameIndex = 218;                //Identificasdor de juego
    var lives;                          //Conteo de vidas
    var sceneGroup = null;              //Grupo padre de toda la escena
    var tutoGroup;                      //Referencia del grupo tutorial en popup
    var heartsGroup = null;             //Referencia al grupo para vidas
    var pointsBar;
    var coin;
    // Fin variables obligatorias dentro del juego

    // Variables opcionales dentro del juego
    var particleCorrect;                //Referencia a particula de correcto        
    var particleWrong;                  //Referencia a particula de incorrecto
    var playerYogotar;                  //Referencia al jugador
    var scenaryGroup;                   //Referencia al grupo que compondra el escenario
    var tileLife;                       //Referencia de vida de agua
    var waterLength;             		//Longitud de agua a mostrar Default: 30px = 8.22%
    var tutorialGroup;                  //Grupo para crear objetos de tutorial
    var gameGroup;                      //Grupo para crear objetos del gameplay
    var gameState;                      //Delegado para cambio de estado en el juego
    var cloudsBackground;               //Referencia de tile de nubes
    var crowdScenary;                   //Referencia de tile de gente
    var tileScenary;                    //Referencia del tile de barra de contencion
    var ground;                         //Grupo de piso
    var grabGroup;                      //Grupo de las posibles cosas a tomar
    var hitBoxStart;                    //Caja que indica el inicio del juego
    var hitBoxDesactive;                //Caja que desactiva objetos que no fueron agarrados
    var reuseGroup;                     //Grupo para reutilizar objetos
    var inputGroup;                     //Grupo que recibira los taps
    var currentSpawnX;                  //Indica la posición actual en X que apareció una bebida
    var cursor;							//Referencia de flechas
    var canMove;						//Bandera para bloqueo de movimientos
    var indexGroundYogotar;				//Bandera de colocacion
    var dictionarySpawn;				//Diccionario de objetos posibles a spawnear
    var speed;                          //Velocidad de avance del juego
    var spaceDrinkAdd;                  //Aumento de espacio conforme a aumento de velocidad
    var speedSpawn;                     //Cada cuanto hara un spawner
    var listOrgans;                     //Lista de los organos
    var tweenA;                         //Lista de animaciones para cerebro
    var tweenB;                         //Lista de animaciones para higado
    var tweenC;                         //Lista de animaciones para instestinos
    var waterStatus;                    //Estado de animaciones para la barra de hidratacion
    var lessWater;                      //Bajado de agua
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
        waterLength = 8.22;
        currentSpawnX = 0;
        cursor = game.input.keyboard.createCursorKeys();
        canMove = true;
        indexGroundYogotar = 1;
        dictionarySpawn = [];
        speed = 2;
        spaceDrinkAdd = 0;
        speedSpawn = 2;
        tweenA = [];
        tweenB = [];
        tweenC = [];
        lessWater = -2;

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

        sound.stop("acornSong")

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

        game.time.events.add(Phaser.Timer.SECOND, startWithTutorial, this);
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

        var pointsImg = pointsBar.create(-10,10,'atlas.h2os','xpcoins');
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

        var heartImg = group.create(0,0,'atlas.h2os','life_box');

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
        playerYogotar.x = 200;
        playerYogotar.y = POSGROUND[1];
        sceneGroup.add(playerYogotar);

        var playerYogotarSpine = game.add.spine(0,0,"yogotar");
        playerYogotarSpine.x = 0;
        playerYogotarSpine.y = 0;
        playerYogotarSpine.scale.setTo(0.65,0.65);
        playerYogotarSpine.setSkinByName("normal");
        playerYogotarSpine.setAnimationByName(0,"idle", true);
        playerYogotarSpine.currentLane = 2;
        playerYogotar.add(playerYogotarSpine);

        var hitBox = new Phaser.Graphics(game);
        hitBox.beginFill(0xFFFFFF);
        hitBox.drawRect(0,0,80,80);
        hitBox.alpha = 0;
        hitBox.endFill();
        hitBox.x = -hitBox.width * 0.5;
        hitBox.y = -hitBox.height - 15;
        playerYogotar.add(hitBox);
        playerYogotar.hitBox = hitBox;
        
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
    }

    //Crea particulas
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.h2os',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle

    }

    // Flujos opcionales helper

    //////////////////////////
    ////// Flujos propios del juego
    //////////////////////////

    //Funcion para crear todo el fondo y escenario de la escena
    function createScenary(){

        var REFCROWD = 120;							//Punto base de colocacion para la audiencia
        var HEIGHTCROWD = 182;						//Altura base de la audiencia
        var ADDGROUND = 170;						//Altura base de agregar al piso
        var TOTALGROUND = 3;                        //Referencia de totales de pisos a poner
        var ADDORGANS = 100;                        //Punto de referencia para colocar cada organo
        var ADDORGANSY = 11;                        //Aumento en y para colocacion de organos

        var refGround = REFCROWD + HEIGHTCROWD;		//Punto base de colocacion para piso
        var lifebarGroup = game.add.group();        //Grupo de barra de agua
        var refWater = game.height*0.825;           //Punto base de colocacion de barra en y
        var refAddOrgans = ADDORGANS;               //Contador de puntos para colocacion de organos
        var refAddOrgansY = refWater + ADDORGANSY;  //Colocacion en y para organos

        listOrgans  = [];

        var recBackground = game.add.graphics(0, 0);
        recBackground.lineStyle(0);
        recBackground.beginFill(0x2B338A, 1);
        recBackground.drawRect(0, 0, game.width, game.height);
        recBackground.endFill();
        sceneGroup.add(recBackground);

       	var backgroundScenary = game.add.tileSprite(0,0,game.width, game.height*0.8,'bground');
       	sceneGroup.add(backgroundScenary);

        cloudsBackground = game.add.tileSprite(0,0,game.width,132,'atlas.h2os','nubes');
        cloudsBackground.alpha = 0.5;
        sceneGroup.add(cloudsBackground);

        crowdScenary = game.add.tileSprite(0,REFCROWD,game.width,HEIGHTCROWD,'atlas.h2os','tile_Crowd');
        sceneGroup.add(crowdScenary);

        tileScenary = game.add.tileSprite(0,REFCROWD + (HEIGHTCROWD*0.755),game.width, 16,'atlas.h2os','Tile');
       	sceneGroup.add(tileScenary);

        ground  = game.add.group();
        for(var indexGround=0; indexGround<TOTALGROUND; indexGround++){
             var groundTemp = game.add.tileSprite(0,refGround,game.width,HEIGHTCROWD,'atlas.h2os','tile_suelo');
             ground.add(groundTemp);
             refGround+=ADDGROUND;
        }
        sceneGroup.add(ground);

        var lifebarGround = game.add.sprite(0, refWater,'atlas.h2os','board_Nuevo');
        lifebarGround.anchor.x = 0.5;
        lifebarGround.x = game.width*0.5;
        lifebarGroup.add(lifebarGround);

        var brainSprite = game.add.sprite(0,refAddOrgansY,'atlas.h2os','brain');
        listOrgans.push(brainSprite);
        var kidneysSprite = game.add.sprite(0,refAddOrgansY+6,'atlas.h2os','kidneys');
        listOrgans.push(kidneysSprite);
        var gutSprite = game.add.sprite(0,refAddOrgansY+2,'atlas.h2os','guts');
        listOrgans.push(gutSprite);

        listOrgans.forEach(function(entry) {
            entry.x = (game.width*0.5)-200+refAddOrgans;
            lifebarGroup.add(entry);
            refAddOrgans+=ADDORGANS;
        });

        tweenA[0] = game.add.tween(listOrgans[0]).to( { x: listOrgans[0].x + 10 }, 100, Phaser.Easing.Bounce.InOut, true, 0, 1000 ,true);
        tweenA[1] = game.add.tween(listOrgans[0].scale).to({x: 0.8, y:0.8}, 400, Phaser.Easing.Cubic.Out, true, 0, 1000, true);
        
        tweenB[0] = game.add.tween(listOrgans[1]).to( { x: listOrgans[1].x + 10 }, 100, Phaser.Easing.Bounce.InOut, true, 0, 1000 ,true);
        tweenB[1] = game.add.tween(listOrgans[1].scale).to({x: 0.8, y:0.8}, 400, Phaser.Easing.Cubic.Out, true, 0, 1000, true);
        
        tweenC[0] = game.add.tween(listOrgans[2]).to( { x: listOrgans[2].x + 10 }, 100, Phaser.Easing.Bounce.InOut, true, 0, 1000 ,true);
        tweenC[1] = game.add.tween(listOrgans[2].scale).to({x: 0.8, y:0.8}, 400, Phaser.Easing.Cubic.Out, true, 0, 1000, true);

        tileLife = game.add.tileSprite((game.width*0.5)-156,refWater + 65,waterLength, 48,'atlas.h2os',"tileBarra");
        lifebarGroup.add(tileLife);
        changeWater(waterLength);

        sceneGroup.add(lifebarGroup);

        inputGroup = game.add.group();
        for (var n = 0; n < 3; n++) {
            var prefabButton = game.add.graphics(0, 0);
            prefabButton.lineStyle(0);
            prefabButton.beginFill(0xFFFFFF, 0);
            prefabButton.drawRect(0, POSGROUND[n] - ((ADDGROUND/2)-20), game.width, 100);
            prefabButton.endFill();
            prefabButton.inputEnabled = true;
            prefabButton.input.useHandCursor = true;
            prefabButton.events.onInputDown.add(clickGround,{param1: n});
            inputGroup.add(prefabButton);
        }
        inputGroup.visible = false;
        sceneGroup.add(inputGroup);
        
        hitBoxDesactive = new Phaser.Graphics(game);
        hitBoxDesactive.beginFill(0xFFFFFF);
        hitBoxDesactive.drawRect(-120,0,50, game.height);
        hitBoxDesactive.alpha = 0;
        hitBoxDesactive.endFill();
        sceneGroup.add(hitBoxDesactive);

        reuseGroup = game.add.group();
        reuseGroup.name = "reuseGroup";
        sceneGroup.add(reuseGroup);
    }

    //Funcion para mostrar el tutorial
    function h2osTutorial(){
        tutorialGroup = game.add.group();
        grabGroup = game.add.group();
        grabGroup.name = "grabGroup";
        sceneGroup.add(tutorialGroup);
        sceneGroup.add(grabGroup);

        for (var y=0; y<3; y+=2){
            eachSPACECONOS = SPACECONOS;
            for(var x=0; x<TOTALGRADAS; x++){
                tutorialGroup.add(addGameObjectsAsSprite(SPACECONOS*(x+1),POSGROUND[y],'cono',0,1));
            }
        }
        for(var z=0; z<3; z++){
            spawner(true);
        }
        for (var q = 0; q < 2; q++) {
            spawner(false);
        }

        hitBoxStart = new Phaser.Graphics(game);
        hitBoxStart.beginFill(0xFFFFFF);
        hitBoxStart.drawRect(SPACECONOS*(TOTALGRADAS+1),0,100, game.height);
        hitBoxStart.alpha = 0;
        hitBoxStart.endFill();
        tutorialGroup.add(hitBoxStart);

    }

    //Funcion para agregar objetos tipo sprite
    function addGameObjectsAsSprite(equis,ye,name,anchorx,anchory){
        var prefab = game.add.sprite(0,0,'atlas.h2os',name);
        prefab.anchor.x = anchorx;
        prefab.anchor.y = anchory;
        prefab.x = equis;
        prefab.y = ye;
        prefab.name = name;
        return prefab;
    }

    //Funciones generales para el flujo del juego
    function scenaryMovement(){
        cloudsBackground.tilePosition.x -= speed / (speed*2); //0.5 inicio
        crowdScenary.tilePosition.x -= speed;
        tileScenary.tilePosition.x -= speed;
        ground.forEach(function(entry) {
            entry.tilePosition.x -= speed;
        });
        tutorialGroup.x -=speed;
        grabGroup.x -=speed;
    }

    //Funcion para crear un delegado
    function createDelegate(func) {
	    return function() { 
	        return func.apply(arguments);
	    };
    }

    //Funcion que se encarga del funcionamiento del tutorial
    function gamePlayTutorial(){
        scenaryMovement();

        grabGroup.forEach(function(entry){
            if (checkOverlap(entry, playerYogotar.hitBox) && !entry.collide){
                sound.play("magic");
                entry.collide = true;
                playAnimation(1);
                grabObject(entry);
                changeWater(33.33);
            }
        });

        if(checkOverlap(hitBoxStart, playerYogotar.hitBox) && !hitBoxStart.collide){
            hitBoxStart.collide = true;
            gameState = createDelegate(gamePlayJuego);
            inputGroup.visible = true;
            game.time.events.add(Phaser.Timer.SECOND*speedSpawn, doSpwaner, this);
        }
    }

    //Funcion para realizar como gameplay
    function gamePlayJuego(){
        scenaryMovement();
        changeWater(lessWater / game.time.totalElapsedSeconds());
        grabGroup.forEach(function(entry){
            if (checkOverlap(entry, playerYogotar.hitBox) && !entry.collide){
                entry.collide = true;
                grabObject(entry);
                if(entry.name == 'agua'){
                    playAnimation(1);
                    changeWater(30);
                    addCoin(playerYogotar);
                        speed += 0.4;
                        spaceDrinkAdd += 5;
                        lessWater *= 2;
                        if(speedSpawn > 0){
                            speedSpawn -= 0.1;
                        }
                }else{
                    changeWater(-30);
                    if(lives-1 <= 0 && waterLength <= 0){
                        playAnimation(3);
                    }else{
                        playAnimation(4);
                    }
                    /*missPoint();
                    if(lives<=0){
                        playAnimation(3);
                    }else{
                        playAnimation(4);
                    }*/
                }
            }
        });
    	if(canMove){
        	if(cursor.up.isDown){
        		indexGroundYogotar--;
        		moveWithKeys();
		    }
		    if(cursor.down.isDown){
		        indexGroundYogotar++;
		        moveWithKeys();
		    }
		    
        } else {
	        if(cursor.up.isUp && cursor.down.isUp){
	        	canMove = true;
	        }
        }
        grabGroup.forEach(function(entry){
            if (checkOverlap(entry, hitBoxDesactive) && !entry.collide){
                entry.collide = true;
                replaceGroup(entry,grabGroup,reuseGroup,0,0);
            }
        });
    }

    //Funcion para realizar movimiento con teclado
    function moveWithKeys(){
    	canMove = false;
    	if(indexGroundYogotar<=0){
			indexGroundYogotar = 0;
		}else if(indexGroundYogotar>=POSGROUND.length){
		   	indexGroundYogotar = POSGROUND.length-1;
		}
		game.add.tween(playerYogotar).to({y: POSGROUND[indexGroundYogotar]}, 200, Phaser.Easing.Cubic.Out, true);
    }

    //Funcion para realizar el estado de pausa
    function gamePlayWait(){}

    //Hacer spawn 
    function doSpwaner(){
        spawner(false);
        game.time.events.add(Phaser.Timer.SECOND*speedSpawn, doSpwaner, this);
    }

    //Funcion para spawnear las bebidas
    function spawner(fijo){
        var prefabSpawn;
        var key;
        var groundIndex;
		currentSpawnX += (SPACEDRINK + spaceDrinkAdd); 

		if (fijo){
			key = 'agua';
			groundIndex = 1;
		} else {
			var typeSpawn = getRandomIndexByProbability();
        	groundIndex = getRandomInt(0,2);
	        if(typeSpawn == 0){
	            key = 'agua';
	        }else{
	            key = 'coca';
	        }
		}   
        if(dictionarySpawn.hasOwnProperty(key)){
        	var listTemp = [];
        	listTemp = dictionarySpawn[key];
            
            for(var d = 0; d < listTemp.length; d++){
                if (listTemp[d].parent.name == 'reuseGroup'){
                    var itemTemp = listTemp[d];
                    itemTemp.kill();
                    itemTemp.destroy();
                    listTemp[d] = grabGroup.add(addGameObjectsAsSprite(currentSpawnX,POSGROUND[groundIndex],key,0,1));
                    return;
                }
            }    
        }else{                                                             
            dictionarySpawn[key] = [];
        }
        dictionarySpawn[key].push(grabGroup.add(addGameObjectsAsSprite(currentSpawnX,POSGROUND[groundIndex],key,0,1)));
    }

    //Funcion para obtener elmentos agarrables con probabilidad
    function getRandomIndexByProbability() {
        var weight = [0.75, 0.35];
        var list = [0,1];
        var weighed_list = [];
        var number;

        var total_weight = weight.reduce(function (prev, cur, i, arr) {
            return prev + cur;
        });
    
        var random_num = getRandomInt(0, total_weight);
        var weight_sum = 0;
    
        for (var i = 0; i < list.length; i++) {
            weight_sum += weight[i];
            weight_sum = +weight_sum.toFixed(2);
            
            if (random_num <= weight_sum) {
                return list[i];
            }
        }
    }

    //Obtener un random entero en un rango inclusivo y inclusivo
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //Clic a boton
    function clickGround(){
        indexGroundYogotar = this.param1;
        game.add.tween(playerYogotar).to({y: POSGROUND[this.param1]}, 200, Phaser.Easing.Cubic.Out, true);
    }

    //Funcion para comenzar el tutorial
    function startWithTutorial(){
        playAnimation(0);
        gameState = createDelegate(gamePlayTutorial);
    }
    
    //Funcion basica de correr
    function playAnimation(id){
        switch(id){
            case 0:
                playerYogotar.setAnimation(["run"],true);
                break;
            case 1:
                playerYogotar.setAnimation(["win2","run"],true);
                break;
            case 2:
                gameState = createDelegate(gamePlayWait);
                playerYogotar.setAnimation(["losestill", "run"],true);
                game.time.events.add(Phaser.Timer.SECOND*2, reloadLife, this);
                break;
            case 3:
            	gameState = createDelegate(gamePlayWait);
                playerYogotar.setAnimation(["lose"], false);
                break;
            case 4:
                playerYogotar.setAnimation(["tired1","run"], true);
                break;
        }
        
    }

    //Funcion para hacer coliciones sin fisica
    function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

    }

    //Funcion que indica que el objeto fue tomado
    function grabObject(object) {

        var tweenFinal;

        if(object.name == 'agua'){
            replaceGroup(object,grabGroup,playerYogotar,0,0);
            game.add.tween(object).to({x: 80}, 200, Phaser.Easing.Cubic.Out, true);
            var tween = game.add.tween(object).to({y: - 100}, 400, Phaser.Easing.Cubic.Out, true);
            game.add.tween(object.scale).to({x: 1.2, y:1.2}, 400, Phaser.Easing.Cubic.Out, true);
            tween.onComplete.add(function () {
                particleCorrect.x = object.world.x;
                particleCorrect.y = object.world.y;

                particleCorrect.start(true, 1000, null, 1)
                tweenFinal = game.add.tween(object).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true);
                tweenFinal.onComplete.add(function () {
                    replaceGroup(object,playerYogotar,reuseGroup,0,0);
                });
            });
        }else{
            particleWrong.x = object.world.x;
            particleWrong.y = object.world.y;
            particleWrong.start(true, 1000, null, 1)
            replaceGroup(object,grabGroup,reuseGroup,0,0);
        }

   
    }

    //Remplazar de grupos
    function replaceGroup(objectChange, oldParent, newParent, equis, ye){
        oldParent.remove(objectChange);
        newParent.add(objectChange);
        objectChange.x = equis;
        objectChange.y = ye;
    }

    //Funcion para cambiar la barra de agua
    function changeWater(number){
        waterLength += MAXWATER * number / 100;
        if(waterLength > MAXWATER){
            waterLength = MAXWATER;
        }else if(waterLength <= 0){
            waterLength = 0;
            resetLife();
        }
        tileLife.width  = waterLength;

        var waterPercentage = waterLength * 100 / MAXWATER;
        organsAnimations(waterPercentage, waterLength);
        
    }

    //Funcion de animacion de organos
    function organsAnimations(waterPercentage, waterLength){
        var tempWaterStatus;
        if(waterPercentage > 83.32){
            tempWaterStatus = 3;            //LLeno
            if(tempWaterStatus != waterStatus){
                waterStatus = tempWaterStatus;
                listOrgans[0].tint = 0xffffff;
                listOrgans[1].tint = 0xffffff;
                listOrgans[2].tint = 0xffffff;
                pauseAnimationsOrgans(true, true, true);
            }
        }else if(waterPercentage > 49.99){
            tempWaterStatus = 2;            //Alto
            if(tempWaterStatus != waterStatus){
                waterStatus = 2;
                listOrgans[0].tint = 0xffffff;
                listOrgans[1].tint = 0xffffff;
                listOrgans[2].tint = 0xff00ff;
                pauseAnimationsOrgans(true, true, false);
                addOrgansAnimation(waterStatus);
            }
        }else if(waterPercentage > 16.66){
            tempWaterStatus = 1;            //Medio
            if(tempWaterStatus != waterStatus){
                 waterStatus = tempWaterStatus;
                listOrgans[0].tint = 0xffffff;
                listOrgans[1].tint = 0xff00ff;
                listOrgans[2].tint = 0xff00ff;
                pauseAnimationsOrgans(true, false, false);
                addOrgansAnimation(waterStatus);
            }
        }else{
            tempWaterStatus = 0;            //Bajo
            if(tempWaterStatus != waterStatus){
                waterStatus = tempWaterStatus;
                listOrgans[0].tint = 0xff00ff;
                listOrgans[1].tint = 0xff00ff;
                listOrgans[2].tint = 0xff00ff;
                pauseAnimationsOrgans(false, false, false);
                addOrgansAnimation(waterStatus);
            }
        }
    }

    //Agregar animaciones
    function addOrgansAnimation(typeAnim){
        switch(typeAnim){
            case 0:
                tweenA[0].resume();
                tweenA[1].resume();
                break;
            case 1:
                tweenB[0].resume();
                tweenB[1].resume();
                break;
            case 2:
                tweenC[0].resume();
                tweenC[1].resume();
                break;
        }
    }

    //Activar o desactivar animaciones
    function pauseAnimationsOrgans(tweenObjA, tweenObjB, tweenObjC){
        if(tweenObjA){
            tweenA[0].pause();
            tweenA[1].pause();
        }
        if(tweenObjB){
            tweenB[0].pause();
            tweenB[1].pause();
        }
        if(tweenObjC){
            tweenC[0].pause();
            tweenC[1].pause();
        }
    }

    //Funcion para reiniciar la vida
    function resetLife(){
        missPoint();
        if((lives-1)<=0){
        	playAnimation(3);
        }else {
        	playAnimation(2);
        }
    }

    function reloadLife(){
    	waterLength = MAXWATER;
        gameState = createDelegate(gamePlayJuego);
    }
    // Fin flujos propios del juego

    //Return realiza toda la carga e inicialiacion de todo (contiene la funcion create)
    //Aqui se declaran el preload, update, create y es necesario assets, name y getGameData
    return {
        assets: assets,
        name: "h2os",
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

            initialize()
            var acornSong = sound.play("acornSong", {loop:true, volume:0.6})

  			//Crear en el orden de atras hacia adelante
            createScenary();
            h2osTutorial();
            createSpine();

            gameGroup = game.add.group();
            sceneGroup.add(gameGroup)

            createTutorial();
            createHearts();
            createPointsBar();
            createCoin();

            particleCorrect = createPart('star');
            sceneGroup.add(particleCorrect);

            particleWrong = createPart('wrong');
            sceneGroup.add(particleWrong);

            buttons.getButton(acornSong,sceneGroup)
        }
    }
}()