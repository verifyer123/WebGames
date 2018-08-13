//Variables globales obligatorias
var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/wildDentist/";

var wildDentist = function(){

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

    var assets = {
        atlases: [
            {
                name: "atlas.game",
                json: imagePath + "atlas.json",
                image: imagePath + "atlas.png",
            }
        ],
        images: [
            {   name: "ondasAgua",
                file: imagePath + "ondas_agua.png"},
            {   name: "rocks",
                file: imagePath + "tile_rocks.png"},
            {   name: "tutorial_image",
                file: imagePath+"tutorial_image.png"}
        ],
        sounds: [
            {   name: "pop",
                file: soundsPath + "pop.mp3"},
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "wrong",
                file: soundsPath + "wrong.mp3"},
            {   name: "whoosh",
                file: soundsPath + "whoosh.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "wrongItem",
                file: soundsPath + "wrongItem.mp3"},
            {   name: "break",
                file: soundsPath + "glassbreak.mp3"},
            {   name: "powerup",
                file: soundsPath + "powerup.mp3"},
            {   name: "balloon",
                file: soundsPath + "inflateballoon.mp3"},
            {   name: "explode",
                file: soundsPath + "fireExplosion.mp3"},
            {   name: "shootBall",
                file: soundsPath + "shootBall.mp3"},
            {   name: "combo",
                file: soundsPath + "combo.mp3"},
            {   name: "combo",
                file: soundsPath + "combo.mp3"},
            {   name: "bite",
                file: soundsPath + "bite.mp3"},
            {   name:"wormwood",
                file: soundsPath + "songs/wormwood.mp3"}
        ],
        spritesheets:[
            {   name: "coin",
               file: "images/wildDentist/coin.png",
               width: 122,
               height: 123,
               frames: 12
            },
            {   name: "bad_breath",
               file: imagePath + 'sprites/bad_breath/sprite.png',
               width: 415,
               height: 271,
               frames: 24
            },
            {   name: "bite",
               file: imagePath + 'sprites/bite/sprite.png',
               width: 292, 
               height: 268, 
               frames: 19
            },{   name: "broken",
               file: imagePath + 'sprites/broken/sprite.png',
               width: 249,
               height: 238,
               frames: 23
            },{   name: "caries",
               file: imagePath + 'sprites/caries/sprite.png', 
               width: 249,
               height: 238,
               frames: 23
            },{   name: "idle",
               file: imagePath + 'sprites/idle/sprite.png',
               width: 249,
               height: 238,
               frames: 24
            },{   name: "hit",
               file: imagePath + 'sprites/hit/sprite.png',
               width: 338,
               height: 268,
               frames: 14
           },{   name: "lose",
               file: imagePath + 'sprites/lose/sprite.png',
               width: 264,
               height: 309,
               frames: 19
           },{   name: "hand",
               file: imagePath + "hand.png",
               width: 115,
               height: 111,
               frames: 23
           }
        ],
        spines:[],
        // particles: [
        //     {
        //         name: 'wood_bite',
        //         file: imagePath +'particles/wood_bite.json',
        //         texture: imagePath +'particles/wood_bite.png'
        //     }
        // ]
    }

    /*vars defautl*/
    var gameIndex = 95;
    var lives = 3;
    var sceneGroup = null;
    var tutoGroup;
    var heartsGroup = null;
    var pointsBar;
    var coin;
    var background;
    var speed = 1.5;
    var speedincrement = 0;
    var speedMove;
    var particleCorrect;      
    var particleWrong;
    var particleTrunk;
    var hand;
    var reviewComic = true;
    /*vars defautl*/
    var castores;
    var arrayTrunks;
    var buttonsOptions;
    var hitZones;
    var ondasCastores = new Array;
    var tileRocks = new Array;
    var trunkPosition;
    var gameState;
    var tutorialColocation;
    var casesInTutorial;
    var tweenHand;
    var changeTween;
    var buttonsSquare;
    var minSpeed;
    var maxSpeed;
    var incrementType;
    var timeParticles;
    var tutorial;
    var indexDrag;
    //var emitter;
    
    function loadSounds(){
        sound.decode(assets.sounds)
    }

    function initialize(){

        game.stage.backgroundColor = "#ffffff";      //Poner siempre un background
        lives = 3;
        speed = 1.5;
        speedincrement = 0;
        starGame = false;
        castores = [
        {id:0,idle:"",bite:"",bad_breath:"",broken:"",caries:"",hit:"",lose:"",clean:true,state:"",biteBeaver:false},
        {id:1,idle:"",bite:"",bad_breath:"",broken:"",caries:"",hit:"",lose:"",clean:true,state:"",biteBeaver:false},
        {id:2,idle:"",bite:"",bad_breath:"",broken:"",caries:"",hit:"",lose:"",clean:true,state:"",biteBeaver:false}];
        arrayTrunks = [
        {tronco1:"",tronco2:"",tronco3:""},
        {tronco1:"",tronco2:"",tronco3:""},
        {tronco1:"",tronco2:"",tronco3:""}];
        buttonsOptions = [];
        hitZones = [];
        trunkPosition = [1,2,3];
        tutorialColocation = [1,0,0];
        casesInTutorial = 0;
        changeTween = false;
        buttonsSquare = [];
        if(game.device.desktop){
            speedMove = [1.0,0.5,0.7];
            minSpeed = 0.5;
            maxSpeed = 1.0;
            incrementType = 0.04;
            timeParticles = 650;
        }else{
            speedMove = [1.3,0.8,1.1];
            minSpeed = 0.8;
            maxSpeed = 1.3;
            incrementType = 0.08;
            timeParticles = 500;
        }
        tutorial = true;
        
        sceneGroup.alpha = 0;
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true);

        loadSounds();                               //Cargar siempre los sonidos

    }

    function preload(){

        game.stage.disableVisibilityChange = false;

    }

    function stopGame(win){

        sound.stop("wormwood");

        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 3000);
        tweenScene.onComplete.add(function(){

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
        game.add.tween(hand).to( { alpha: 1 }, 300, Phaser.Easing.Bounce.In, true, 0, 0);
        gameState = createDelegate(levelZero); 
    }

    function update() {
        //epicparticles.update();
        if(gameState!=null){
            gameState();
        }
    }

    function createPointsBar(){

        pointsBar = game.add.group();
        pointsBar.x = game.world.width;
        pointsBar.y = 0;
        sceneGroup.add(pointsBar);

        var pointsImg = pointsBar.create(-10,10,'atlas.game','xpcoins');
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
    }

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

    function createCoin(){
      coin = game.add.sprite(0, 0, "coin");
      coin.anchor.setTo(0.5);
      coin.scale.setTo(0.8);
      coin.animations.add('coin');
      coin.animations.play('coin', 24, true);
      coin.alpha = 0;
   }

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

    function createHearts(){

        heartsGroup = game.add.group();
        heartsGroup.y = 10;
        sceneGroup.add(heartsGroup);

        var pivotX = 10;
        var group = game.add.group();
        group.x = pivotX;
        heartsGroup.add(group);

        var heartImg = group.create(0,0,'atlas.game','life_box');

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

    function missPoint(){

        sound.play("wrong");

        lives--;
        heartsGroup.text.setText('X ' + lives);

        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true);
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true);
        })

        if(lives === 0){
            console.log("Perdio!!");
            gameOver();
            stopGame(false);
        }

        addNumberPart(heartsGroup.text,'-1');
    }

    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.game',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle;
    }

    function createDelegate(func) {
        return function() { 
            return func.apply(arguments);
        };
    }

    function levelZero(){
        if(casesInTutorial > 2){
            tweenHand.stop();
            for(var i = 0; i<3; i++){
                buttonsSquare[i].tint = 0xffffff;
                buttonsOptions[i].tint = 0xffffff;
                buttonsOptions[i].input.enabled = true;
                buttonsOptions[i].events.onDragStart.removeAll();
                buttonsOptions[i].events.onDragStop.removeAll();
                buttonsOptions[i].events.onDragStart.add(onDragStart, this);
                buttonsOptions[i].events.onDragStop.add(onDragStop, this);
            }
            hand.alpha = 0;
            starGame = true;
            tutorial = false;
            gameState = createDelegate(gamePlay); 
        }else if(changeTween && casesInTutorial == 1){
            changeTween = false;
            for(var i = 0; i<3; i++){
                buttonsSquare[i].tint = 0x909090;
                buttonsOptions[i].tint = 0x909090;
                buttonsOptions[i].input.enabled = false;
                buttonsOptions[i].events.onDragStart.removeAll();
                buttonsOptions[i].events.onDragStop.removeAll();
            }
            createChangeTweenHand(1);
        }else if(changeTween && casesInTutorial == 2){
            changeTween = false;
            for(var i = 0; i<3; i++){
                buttonsSquare[i].tint = 0x909090;
                buttonsOptions[i].tint = 0x909090;
                buttonsOptions[i].input.enabled = false;
                buttonsOptions[i].events.onDragStart.removeAll();
                buttonsOptions[i].events.onDragStop.removeAll();
            }
            createChangeTweenHand(0);
        }
    }

    function gamePlay(){
        if(starGame){   
            if(lives != 0){ 
                for(var p = 0; p<=2;p++){
                    moveTrunk(arrayTrunks[p],speedMove[p]+speedincrement,castores[p], p)//speed
                }
            }else{
                starGame = false;
                for(var p = 0; p<=2;p++){
                    castores[p].biteBeaver = false;
                    castores[p].clean = true;
                    castores[p].state = "";
                }
            }
        }
    }

    function getRandomArbitrary(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
    }

    function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

    }

    function randomFloatBetween(minValue,maxValue,precision){
        if(typeof(precision) == 'undefined'){
            precision = 2;
        }
        return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue).toFixed(precision));
    }

    function moveTrunk(trunk,speed,target, index){
            if(!target.biteBeaver){
                if(trunk.tronco1.x > (target.idle.x + target.idle.width/1.5)){
                        trunk.tronco1.x -= speed;
                        trunk.tronco2.x = trunk.tronco1.x;
                        trunk.tronco3.x = trunk.tronco1.x
                        trunk.tronco1.alpha = 1;   
                    
                }else{
                    
                     if(target.clean){
                        target.idle.alpha = 0;
                        target.bite.alpha = 1;
                        target.biteBeaver = true;
                        updateBeaver(trunk,speed,target);
                     }else{
                        target.clean = true;
                        target.state.alpha = 0;
                        target.hit.alpha = 1;
                        target.biteBeaver = true;
                        hitBeaver(trunk,target);
                    }
                    speedMove[index] = randomFloatBetween(minSpeed,maxSpeed,1);
                }
            }
        }    
    
    function hitBeaver(trunk,target){
        game.add.tween(trunk.tronco1).to({alpha:0},500,"Linear",true,0).onComplete.add(function(){
            target.clean = false;
            target.state.alpha = 1; 
            trunk.tronco1.x = game.width + 100;
            trunk.tronco1.alpha = 1;
            target.hit.alpha = 0;
            target.biteBeaver = false;
            particleWrong.x = target.idle.world.x + target.idle.width/2;
            particleWrong.y = target.idle.world.y + target.idle.height/2;
            particleWrong.start(true, timeParticles, null, 5);
            
            if(lives != 0){ 
               missPoint();
            }else{
                starGame = false;
            }
        });
    }

    function gameOver(){
        for(var c=0; c<3; c++){
            if(castores[c].stage != null){
                castores[c].state.alpha = 0;
            }else{
                castores[c].idle.alpha = 0;
                castores[c].hit.alpha = 0;
                castores[c].bite.alpha = 0;
                castores[c].bad_breath.alpha = 0;
                castores[c].broken.alpha = 0;
                castores[c].caries.alpha = 0;
            }
            castores[c].lose.alpha = 1;
        }
    }
      
    function updateBeaver(trunk,speed,target){
        var counter = 1;
        var anim = target.bite.animations.add('castorAnima2');
        anim.onLoop.add(eatTrunk, this);
        anim.play(speed * 48, true);//12
        
        function eatTrunk(){
            if(counter == 1){
                particleTrunkEmitter(target.bite)
                trunk.tronco1.alpha = 0;
                trunk.tronco2.alpha = 1; 
                sound.play("bite");
                 counter++;
            }else if(counter == 2){
                particleTrunkEmitter(target.bite)
               trunk.tronco2.alpha = 0;
               trunk.tronco3.alpha = 1; 
                sound.play("bite");
                 counter++;
            }else if(counter == 3){ 
                particleTrunkEmitter(target.bite)
                trunk.tronco3.alpha = 0;
                counter = 0;
                target.bite.alpha = 0;
                sound.play("bite");
                trunk.tronco1.alpha = 1;
                trunk.tronco1.x = game.width + 100;
                target.biteBeaver = false;
                
                switch(getRandomArbitrary(0,3)){
                    case 0:
                        target.clean = false;
                        target.caries.alpha = 1;
                        hitZones[target.id].id = 0; 
                        target.state = target.caries;
                    break;
                    case 1:
                        target.clean = false;
                        target.broken.alpha = 1;  
                        hitZones[target.id].id = 1;  
                        target.state = target.broken;  
                    break;
                    case 2:
                        target.clean = false;
                        target.bad_breath.alpha = 1;
                        hitZones[target.id].id = 2; 
                        target.state = target.bad_breath;
                         
                    break;
                       }
            }
           
        }
        
    }

    function particleTrunkEmitter(target){
        particleTrunk.x = target.x + target.width/2 + 10;
        particleTrunk.y = target.y + target.height/2 + 50;
        particleTrunk.start(true, timeParticles, null, 7);
    }
    
    /*CREATE SCENE*/
    function createScene(){
        background = game.add.tileSprite(0,0,game.world.width, 216,"atlas.game", "tile_sky");
        sceneGroup.add(background);
        var groupTrunks = game.add.group();   
        
        var seaBg = new Phaser.Graphics(game);
        seaBg.beginFill(0x45B4AF);
        seaBg.drawRect(0,160,game.world.width, game.world.height);
        seaBg.endFill();
        sceneGroup.add(seaBg);
        //sceneGroup.add(groupTrunks);
        shuffle(trunkPosition);
        for(var i=0;i<=2;i++){
                
            castores[i].idle = game.add.sprite(50, 0, 'idle');
            var castorAnima = castores[i].idle.animations.add('castorAnima');
            castores[i].idle.animations.play('castorAnima', 24, true);
            castores[i].idle.anchor.setTo(0.1,0); 
            castores[i].idle.y = 20 + castores[i].idle.height * i;
            castores[i].idle.alpha = 0;
            sceneGroup.add(castores[i].idle);  
        
            castores[i].hit = game.add.sprite(-30, 0, 'hit');
            var castorAnimahit = castores[i].hit.animations.add('castorAnimahit');
            castores[i].hit.animations.play('castorAnimahit', 24, true);
            castores[i].hit.anchor.setTo(0.1,0); 
            castores[i].hit.y = castores[i].idle.height * i - 10;
            castores[i].hit.alpha = 0;
            sceneGroup.add(castores[i].hit);            
            
            castores[i].bite = game.add.sprite(30, 0, 'bite');
            var castorAnima2 = castores[i].bite.animations.add('castorAnima2');
            castores[i].bite.animations.play('castorAnima2', 24, true);
            castores[i].bite.anchor.setTo(0.1,0); 
            castores[i].bite.y = -10 + castores[i].idle.height * i;
            castores[i].bite.alpha = 0;
            sceneGroup.add(castores[i].bite);                    
        
            castores[i].bad_breath = game.add.sprite(55, 0, 'bad_breath');
            var castorAnima3 = castores[i].bad_breath.animations.add('castorAnima3');
            castores[i].bad_breath.animations.play('castorAnima3', 24, true);
            castores[i].bad_breath.anchor.setTo(0.1,0); 
            castores[i].bad_breath.y = 0 + castores[i].idle.height * i;
            castores[i].bad_breath.alpha = tutorialColocation[0];
            sceneGroup.add(castores[i].bad_breath);

            castores[i].broken = game.add.sprite(55, 0, 'broken');
            var castorAnima4 = castores[i].broken.animations.add('castorAnima4');
            castores[i].broken.animations.play('castorAnima4', 24, true);
            castores[i].broken.anchor.setTo(0.1,0); 
            castores[i].broken.y = 30 + castores[i].idle.height * i;
            castores[i].broken.alpha = tutorialColocation[1];
            sceneGroup.add(castores[i].broken);  

            castores[i].caries = game.add.sprite(55, 0, 'caries');
            var castorAnima5 = castores[i].caries.animations.add('castorAnima5');
            castores[i].caries.animations.play('castorAnima5', 24, true);
            castores[i].caries.anchor.setTo(0.1,0); 
            castores[i].caries.y = 30 + castores[i].caries.height * i;
            castores[i].caries.alpha = tutorialColocation[2];
            sceneGroup.add(castores[i].caries);

            castores[i].lose = game.add.sprite(45, 0, 'lose');
            var castorAnima6 = castores[i].lose.animations.add('castorAnima6');
            castores[i].lose.animations.play('castorAnima6', 24, true);
            castores[i].lose.anchor.setTo(0.1,0); 
            castores[i].lose.y = castores[i].idle.height * i - 42;
            castores[i].lose.alpha = 0;
            sceneGroup.add(castores[i].lose);            
        
            ondasCastores[i] = sceneGroup.create(0,castores[i].idle.y,"ondasAgua");
            ondasCastores[i].x = ondasCastores[i].x + ondasCastores[i].width/2 - 20;
            ondasCastores[i].y = ondasCastores[i].y + castores[i].idle.height/1.5;
            ondasCastores[i].scale.setTo(0.7);
            ondasCastores[i].anchor.setTo(0.5,0);
            TweenMax.fromTo(ondasCastores[i].scale,1,{x:0.7},{x:0.8,repeat:-1,yoyo:true});
            arrayTrunks[i].tronco1 = groupTrunks.create(0,0,"atlas.game","tronco1");
            arrayTrunks[i].tronco1.scale.setTo(0.7,0.7);
            arrayTrunks[i].tronco1.x = game.width - (trunkPosition[i] * 50);
            arrayTrunks[i].tronco1.y = castores[i].idle.y + arrayTrunks[i].tronco1.height + 30;        
            arrayTrunks[i].tronco2 = groupTrunks.create(0,0,"atlas.game","tronco2");
            arrayTrunks[i].tronco2.scale.setTo(0.7,0.7);
            arrayTrunks[i].tronco2.x = arrayTrunks[i].tronco1.x;
            arrayTrunks[i].tronco2.y = castores[i].idle.y + arrayTrunks[i].tronco2.height + 30; 
            arrayTrunks[i].tronco2.alpha = 0;
            arrayTrunks[i].tronco3 = groupTrunks.create(0,0,"atlas.game","tronco3");
            arrayTrunks[i].tronco3.scale.setTo(0.7,0.7); 
            arrayTrunks[i].tronco3.x = arrayTrunks[i].tronco1.x - 20;
            arrayTrunks[i].tronco3.y = castores[i].idle.y + arrayTrunks[i].tronco3.height + 30;
            arrayTrunks[i].tronco3.alpha = 0;

            tileRocks[i] = game.add.tileSprite(0,0,game.width,155,"rocks");
            tileRocks[i].height = 155;
            tileRocks[i].y = arrayTrunks[i].tronco1.y + tileRocks[i].height/2;
            sceneGroup.add(tileRocks[i]);
        
            hitZones[i] = new Phaser.Graphics(game)
            hitZones[i].beginFill(0x0aff55)
            hitZones[i].drawRect(castores[i].idle.x + 50,castores[i].idle.y + 100,castores[i].idle.width/2, castores[i].idle.height/4);
            hitZones[i].alpha = 0;
            hitZones[i].id = 2-i;
            hitZones[i].endFill(); 
            sceneGroup.add(hitZones[i]);

            if(i < tutorialColocation.length-1){
                tutorialColocation[i+1] = tutorialColocation[i];
                tutorialColocation[i] = 0;
            }
            castores[i].clean = false;
        }

        sceneGroup.add(groupTrunks);
        
        var container = sceneGroup.create(0,0,"atlas.game","contenedor");
        container.y = game.height - container.height + 10;
        container.width = game.width;
        
        var square;
        var nameSquare = ["brush","floss","enjuague"];
        var nameElement = ["brush_iso","floss_iso","wash_iso"];
        var spaceQuare = 0.4;
        var anchorX = [0.5,0.35,0.5];
        var anchorY = [0.65,0.9,0.6];
        var tintSquare = [0xffffff,0x909090,0x909090];
        for(var sindex=0; sindex<3; sindex++){
            square = sceneGroup.create(0,0,"atlas.game",nameSquare[sindex]);
            square.y = game.height - square.height/2 - 10;
            square.x = game.world.centerX * spaceQuare;
            square.anchor.setTo(0.5,0.5);
            buttonsSquare.push(square);
            spaceQuare+=0.6;
        }
        for(var bindex = nameElement.length - 1; bindex>=0; bindex--){
            spaceQuare-=0.6;
            buttonsOptions[bindex] = sceneGroup.create(0,0,"atlas.game",nameElement[bindex]);
            buttonsOptions[bindex].id = bindex;
            buttonsOptions[bindex].y = game.height - buttonsOptions[bindex].height/2 - 10;    
            buttonsOptions[bindex].x = game.world.centerX * spaceQuare;
            buttonsOptions[bindex].posx = buttonsOptions[bindex].x;
            buttonsOptions[bindex].posy = buttonsOptions[bindex].y;
            buttonsOptions[bindex].inputEnabled = true;
            buttonsOptions[bindex].anchor.setTo(anchorX[bindex],anchorY[bindex]);
            buttonsSquare[bindex].tint = tintSquare[bindex];
            buttonsOptions[bindex].tint = tintSquare[bindex];
        }

        hand = game.add.sprite(0, 0, "hand");
        hand.animations.add('hand');
        hand.animations.play('hand', 24, true);
        hand.alpha = 0;
        createChangeTweenHand(2);

        // emitter = epicparticles.newEmitter("wood_bite");
        // emitter.x = 30;
        // emitter.y = 30;  
    }

    function createChangeTweenHand(index){
        var indexInverse = 2-index;
        buttonsSquare[indexInverse].tint = 0xffffff;
        buttonsOptions[indexInverse].tint = 0xffffff;
        buttonsOptions[indexInverse].input.enabled = true;
        buttonsOptions[indexInverse].input.enableDrag();
        buttonsOptions[indexInverse].events.onDragStart.add(onDragStart, this);
        buttonsOptions[indexInverse].events.onDragStop.add(onDragStop, this);
        hand.x = buttonsOptions[indexInverse].x;
        hand.y = buttonsOptions[indexInverse].y;
        if(tweenHand != null){
            tweenHand.stop();
        }
        tweenHand = game.add.tween(hand).to( { x: castores[index].idle.x + (castores[index].idle.width/2), y: castores[index].idle.y + (castores[index].idle.height/2)}, 2000, Phaser.Easing.Linear.InOut, true, 0, -1); 
    }

    function shuffle(array) {
        let counter = array.length;

        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter--;

            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }
    
   function onDragStart(sprite, pointer) {
       indexDrag = sceneGroup.getIndex(sprite);
       sceneGroup.bringToTop(sprite); 
    }
    
    function onDragStop(sprite, pointer) {
        
        for(var d = 0;d<=2;d++){
            
            if(hitZones[d].id == sprite.id){
                if(castores[d].clean == false){
                if (checkOverlap(hitZones[d], sprite) ){
                            castores[d].broken.alpha = 0;
                            castores[d].bad_breath.alpha = 0; 
                            castores[d].caries.alpha = 0;
                            castores[d].idle.alpha = 1;
                            castores[d].biteBeaver = false;
                            castores[d].clean = true;
                            speed = speed + 0.08;//0.05
                            speedincrement += incrementType;
                            particleCorrect.x = castores[d].idle.world.x + castores[d].idle.width/2;
                            particleCorrect.y = castores[d].idle.world.y + castores[d].idle.height/2;
                            particleCorrect.start(true, timeParticles, null, 5);
                            hitZones[d].id = 4;
                            if(starGame){
                                 addCoin(castores[d].idle);
                            }else{
                                casesInTutorial++;
                                changeTween = true;
                            }
                    }
                }
            }else{
                if (checkOverlap(hitZones[d], sprite) ){
                    if(!tutorial){
                        particleWrong.x = castores[d].idle.world.x + castores[d].idle.width/2;
                        particleWrong.y = castores[d].idle.world.y + castores[d].idle.height/2;
                        particleWrong.start(true, timeParticles, null, 5);
                    }
                    if(starGame){
                        missPoint();
                    }
                }
            }
        
        }
        sprite.scale.setTo(0);
        sprite.x = sprite.posx;
        sprite.y = sprite.posy;
        game.add.tween(sprite.scale).to({x:1,y:1},300,Phaser.Easing.linear,true);
        sceneGroup.setChildIndex(sprite, indexDrag);
    }

    return {
        assets: assets,
        name: "wildDentist",
        preload:preload,
        update:update,
        create: function(event){

            sceneGroup = game.add.group();
            //yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

            game.onPause.add(function(){
                game.sound.mute = true;
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false;
            }, this);

            initialize();
            var wildDentistSong = sound.play("wormwood", {loop:true, volume:0.6})
            createScene();

            createHearts();
            createPointsBar();
            createCoin();
            createTutorial();

            particleCorrect = createPart("star");
            sceneGroup.add(particleCorrect);

            particleWrong = createPart("smoke");
            sceneGroup.add(particleWrong);

            particleTrunk = createPart("wood_bite");
            sceneGroup.add(particleTrunk);
            
            buttons.getButton(wildDentistSong,sceneGroup);
        }       
    }
}()