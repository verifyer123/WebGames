//Variables globales obligatorias
var soundsPath = "../../shared/minigames/sounds/";

var dinamitaDance = function(){
    
    var localizationData = {
        "EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
            "stop":"Stop!",
            "tutorial_image": "images/dinamitaDance/gameTuto_EN.png"
        },

        "ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
            "tutorial_image": "images/dinamitaDance/gameTuto_ES.png"
        }
    }
    

    var assets = {
        atlases: [
            {   
                name: "atlas.dinamitaDance",
                json: "images/dinamitaDance/atlas.json",
                image: "images/dinamitaDance/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/dinamitaDance/timeAtlas.json",
                image: "images/dinamitaDance/timeAtlas.png",
            },

        ],
        images: [
            {   name:"background",
                file: "images/dinamitaDance/background.png"},
            {   name:'danceFloor',
                file:"images/dinamitaDance/danceFloor.png"},
            {   name:'tutorial_image',
                file:"%lang"}

        ],
        sounds: [
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "cut",
                file: soundsPath + "cut.mp3"},
            {   name: "wrong",
                file: soundsPath + "wrong.mp3"},
            {   name: "rightChoice",
                file: soundsPath + "rightChoice.mp3"},
            {   name: "pop",
                file: soundsPath + "pop.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "danceSong",
                file: soundsPath + "songs/shooting_stars.mp3"}
        ], 
        spritesheets:[
            {   name: "coin",
               file: "images/dinamitaDance/coin.png",
               width: 122,
               height: 123,
               frames: 12
            },
            {   name: "hand",
               file: "images/dinamitaDance/hand.png",
               width: 115,
               height: 111,
               frames: 23
           }
        ],
        spines:[
            {
                name:"dinamita",
                file:"images/spines/Dinamita/dinamita.json"
            },{
                name:"boton",
                file:"images/spines/Boton/boton.json"
            }
        ]
    }

    var lives = null;
    var sceneGroup = null;
    var gameActive;
    var gameIndex = 119;
    var danceSong;
    var body;
    var fontStyle;
    var allButtonsGroup;
    var glitGroup;
    var win;
    var pivot;
    var glitter = ['glitter1', 'glitter2', 'glitter3', 'glitter4'];
    var dinamita;
    var bodyPart;
    var tutoPivot;
    var time;
    var particleCorrect;      
    var particleWrong;
    var hand;
    var tutoGroup;
    var heartsGroup = null;
    var pointsBar;
    var coin;
    
    function loadSounds(){
        sound.decode(assets.sounds);
    }

    function initialize(){

        game.stage.backgroundColor = "#ffffff";
        lives = 3;
        gameActive = false;
        pivot = 0;
        win = true;
        bodyPart = -1;
        tutoPivot = 0;
        time = 6000;
        
        if(localization.getLanguage() === 'EN'){
            body = ['Head', 'Arms', 'Hands', 'Feet'];
            fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
        }
        else{
            body = ['Cabeza', 'Brazos', 'Manos', 'Pies'];
            fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
        }
        
        loadSounds();

    }

    function preload(){

        game.stage.disableVisibilityChange = false;

    }

    function stopGame(win){

        //sound.stop("wormwood");

        gameActive = false;
        danceSong.stop();

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
        initTuto();
    }

    function update() {
    }

    function createPointsBar(){

        pointsBar = game.add.group();
        pointsBar.x = game.world.width;
        pointsBar.y = 0;
        sceneGroup.add(pointsBar);

        var pointsImg = pointsBar.create(-10,10,'atlas.dinamitaDance','xpcoins');
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

        var heartImg = group.create(0,0,'atlas.dinamitaDance','life_box');

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
            stopGame(false);
        }

        addNumberPart(heartsGroup.text,'-1');
    }

    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.dinamitaDance',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle;
    }
    
    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
        },this);
    }

    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0;
            if( i == index){
                group.children[i].alpha = 1;
            }
        }
    }

    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1;
    }

    function createBackground(){
        
        var background  = sceneGroup.create(0, 0, "background");
        background.width = game.world.width;
        background.height = game.world.height;
        
        var bottom  = game.add.image(0, game.world.height, "atlas.dinamitaDance", "bottom");
        bottom.anchor.setTo(0, 1);
        bottom.width = game.world.width;
        bottom.height = game.world.height * 0.3;
        
        var danceFloor  = sceneGroup.create(0, bottom.y - bottom.height + 25, "danceFloor");
        danceFloor.anchor.setTo(0, 1); 
        danceFloor.width = game.world.width;
        danceFloor.height = game.world.height * 0.3;
        sceneGroup.add(bottom);
        
        buttonsBase  = sceneGroup.create(bottom.centerX, bottom.centerY + 15, "atlas.dinamitaDance", "buttonsBase");
        buttonsBase.anchor.setTo(0.5);
        buttonsBase.width = game.world.width * 0.9;
        buttonsBase.height = bottom.height * 0.75;
        
        var light0  = sceneGroup.create(10, 20, "atlas.dinamitaDance", "light0");
        light0.scale.setTo(1.2);
        
        var light1  = sceneGroup.create(game.world.width - 10, 40, "atlas.dinamitaDance", "light1");
        light1.scale.setTo(1.2);
        light1.anchor.setTo(1, 0);
    }

    // function setExplosion(obj){
        
    //     var posX = obj.x
    //     var posY = obj.y
        
    //     if(obj.world){
    //         posX = obj.world.x
    //         posY = obj.world.y
    //     }
        
    //     var rect = new Phaser.Graphics(game)
    //     rect.beginFill(0xffffff)
    //     rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
    //     rect.alpha = 0
    //     rect.endFill()
    //     sceneGroup.add(rect)
        
    //     game.add.tween(rect).from({alpha:1},500,"Linear",true)
        
    //     var exp = sceneGroup.create(0,0,'atlas.dinamitaDance','cakeSplat')
    //     exp.x = posX
    //     exp.y = posY
    //     exp.anchor.setTo(0.5,0.5)

    //     exp.scale.setTo(6,6)
    //     game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
    //     var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
    //     particlesNumber = 8
            
    //     var particlesGood = game.add.emitter(0, 0, 100);

    //     particlesGood.makeParticles('atlas.dinamitaDance','smoke');
    //     particlesGood.minParticleSpeed.setTo(-200, -50);
    //     particlesGood.maxParticleSpeed.setTo(200, -100);
    //     particlesGood.minParticleScale = 0.6;
    //     particlesGood.maxParticleScale = 1.5;
    //     particlesGood.gravity = 150;
    //     particlesGood.angularDrag = 30;

    //     particlesGood.x = posX;
    //     particlesGood.y = posY;
    //     particlesGood.start(true, 1000, null, particlesNumber);

    //     game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
    //     sceneGroup.add(particlesGood)
        
    // }

    function positionTimer(){
        
        timerGroup = game.add.group()
        timerGroup.scale.setTo(1.5)
        timerGroup.alpha = 0
        sceneGroup.add(timerGroup)
        
        var clock = game.add.image(0, 0, "atlas.time", "clock")
        clock.scale.setTo(0.7)
        clock.alpha = 1
        timerGroup.add(clock)
        
        timeBar = game.add.image(clock.position.x + 40, clock.position.y + 40, "atlas.time", "bar")
        timeBar.scale.setTo(8, 0.45)
        timeBar.alpha = 1
        timerGroup.add(timeBar)
        
        timerGroup.x = game.world.centerX - clock.width * 0.75
        timerGroup.y = clock.height * 0.4
   }
    
    function stopTimer(){
        
        tweenTiempo.stop()
        tweenTiempo = game.add.tween(timeBar.scale).to({x:8}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        tweenTiempo = game.add.tween(timeBar.scale).to({x:0}, time, Phaser.Easing.Linear.Out, true, 100)
        tweenTiempo.onComplete.add(function(){
            danceTest(-1)
        })
    }
    
    function lightsOn(){
           
        glitGroup = game.add.group()
        sceneGroup.add(glitGroup)
        
        for(var l = 0; l < 25; l ++){
            var glit = game.add.sprite(0, 0, "atlas.dinamitaDance", glitter[game.rnd.integerInRange(0, 3)])
            glit.alpha = 0
            glitGroup.add(glit)
        }
        
        theShining()
    }
    
    function theShining(){
        
        glitGroup.children[pivot].alpha = 1
        glitGroup.children[pivot].x = game.world.randomX
        glitGroup.children[pivot].y = game.world.randomX
    
        game.time.events.add(150,function(){
            game.add.tween(glitGroup.children[pivot]).to({ alpha: 0 }, 1000, Phaser.Easing.linear, true)
            
            if(pivot < 19){
                pivot++
            }
            else{
                pivot = 0
            }
               
            if(win){
                theShining()
            }
        }, this)
    } 
    
    function tnt(){
        
        dinamita = game.add.spine(game.world.centerX, game.world.centerY, "dinamita");
        dinamita.setAnimationByName(0, "idle", true);
        dinamita.setSkinByName("normal");
        sceneGroup.add(dinamita);

        hand = game.add.sprite(0, 0, "hand");
        hand.animations.add('hand');
        hand.animations.play('hand', 24, true);
        hand.alpha = 0;
    }

    function changeHand(index){
        hand.x = allButtonsGroup.x + allButtonsGroup.getAt(index).x;
        hand.y = allButtonsGroup.y + allButtonsGroup.getAt(index).y;
    }
    
    function saturdayFeverNight(dance){
        
        switch(dance){
            case 0:
                dinamita.setAnimationByName(0, "idle_head", true)
            break
            case 1:
                dinamita.setAnimationByName(0, "idle_arm", true)
            break
            case 2:
                dinamita.setAnimationByName(0, "idle_hands", true)
            break
            case 3:
                dinamita.setAnimationByName(0, "idle_legs", true)
            break
            case 4:
                dinamita.setAnimationByName(0, "idle", true)
            break
            case 5:
                dinamita.setAnimationByName(0, "win", true) //idle_foot
            break
            case 6:
                dinamita.setAnimationByName(0, "lose", true)
            break
        }
    }
    
    function initButtons(){
        
        var aux = 0
        
        allButtonsGroup = game.add.group()
        allButtonsGroup.x = buttonsBase.centerX - 100
        allButtonsGroup.y = buttonsBase.centerY - 50 
        sceneGroup.add(allButtonsGroup)
        
        for(var b = 0; b < body.length - 2; b++){
            for(var y = 0; y < body.length - 2; y++){

                var buttonsGroup = game.add.group();
                buttonsGroup.x += (b * 200);
                buttonsGroup.y += (y * 100);
                buttonsGroup.scale.setTo(1.15);
                allButtonsGroup.add(buttonsGroup);

                var btnOff = buttonsGroup.create(0, 0, "atlas.dinamitaDance", "buttonOFF"); // 0
                btnOff.anchor.setTo(0.5);
                btnOff.inputEnabled = true;
                btnOff.bodyPart = aux;
                // btnOff.events.onInputDown.add(btnPressed, this)   
                // btnOff.events.onInputUp.add(btnRelased, this) 

                var btnOn = buttonsGroup.create(0, 0, "atlas.dinamitaDance", "buttonON"); // 1
                btnOn.anchor.setTo(0.5);
                btnOn.alpha = 0;
                
                var shineButton = game.add.spine(0, 0, "boton"); // 2
                shineButton.setAnimationByName(0, "SHINE", true);
                shineButton.setSkinByName("normal");
                shineButton.alpha = 0;
                buttonsGroup.add(shineButton);

                var btnTxt = new Phaser.Text(sceneGroup.game, 0, 2, '', fontStyle) // 3
                btnTxt.anchor.setTo(0.5);
                btnTxt.setText(body[aux]);
                buttonsGroup.add(btnTxt);

                buttonsGroup.setAll('tint', 0x909090);
                aux++
            }
        }
    }
    
    function btnPressed(btn){
        
        if(gameActive){
            sound.play('pop')
            btn.parent.children[0].alpha = 0
            btn.parent.children[1].alpha = 1
            btn.parent.children[3].scale.setTo(0.9)
            
            if(tutoPivot === 4){
                danceTest(btn.bodyPart)
            }
            else{
                danceTestTuto(btn.bodyPart)
            }
        }
    }
    
    function btnRelased(btn){
        
        btn.parent.children[0].alpha = 1
        btn.parent.children[1].alpha = 0
        btn.parent.children[3].scale.setTo(1)
    }
    
    function danceTest(choise){
        
        if(gameActive){

            gameActive = false;
            stopTimer();
            
            for(var b = 0; b < body.length; b++){
                allButtonsGroup.children[b].setAll('tint', 0x909090);
            }
            //allButtonsGroup.children[bodyPart].setAll('tint', 0xffffff);
            allButtonsGroup.children[bodyPart].children[2].alpha = 1;

            if(choise === bodyPart){
                //addPoint(1)
                particleCorrect.x = dinamita.x;
                particleCorrect.y = dinamita.y;
                particleCorrect.start(true, 1000, null, 5);
                addCoin(dinamita);
                saturdayFeverNight(5);
                if(time > 500)
                    time -= 200;
            }
            else{
                saturdayFeverNight(6);
                win = false;
                particleWrong.x = dinamita.x;
                particleWrong.y = dinamita.y;
                particleWrong.start(true, 1000, null, 5);
                missPoint();
            }

            game.time.events.add(3000,function(){
                
                if(lives !== 0){
                    saturdayFeverNight(4);
                    initGame();
                }
            })
        }
    }
    
    function initGame(){
        
        bodyPart = getRand();

        allButtonsGroup.getAt(tutoPivot-1).getAt(0).events.onInputDown.removeAll();
        allButtonsGroup.getAt(tutoPivot-1).getAt(0).events.onInputUp.removeAll();
        
        for(var b = 0; b < body.length; b++){
            allButtonsGroup.children[b].setAll('tint', 0xffffff);
            allButtonsGroup.children[b].children[2].alpha = 0;
            allButtonsGroup.children[b].children[0].events.onInputDown.add(btnPressed, this);
            allButtonsGroup.children[b].children[0].events.onInputUp.add(btnRelased, this);
        }
        
        game.time.events.add(500,function(){
            gameActive = true
            saturdayFeverNight(bodyPart)
            startTimer(time)
            if(!win){
                win = true
                theShining()
            }
        },this)
        
    }

    function getRand(){
        var x = game.rnd.integerInRange(0, 3)
        if(x === bodyPart)
            return getRand()
        else
            return x     
    }
    
    function initTuto(){

        game.add.tween(hand).to( { alpha: 1 }, 500, Phaser.Easing.Bounce.In, true, 0, 0);
        
        for(var b = 0; b < body.length; b++){
            allButtonsGroup.children[b].setAll('tint', 0xffffff);
            allButtonsGroup.children[b].children[2].alpha = 0;
            allButtonsGroup.children[b].children[0].events.onInputDown.removeAll();
            allButtonsGroup.children[b].children[0].events.onInputUp.removeAll();
        }
        
        allButtonsGroup.children[tutoPivot].setAll('tint', 0xffffff);
        allButtonsGroup.children[tutoPivot].children[2].alpha = 1;
        allButtonsGroup.getAt(tutoPivot).getAt(0).events.onInputDown.add(btnPressed, this);
        allButtonsGroup.getAt(tutoPivot).getAt(0).events.onInputUp.add(btnRelased, this);
        changeHand(tutoPivot);
        
        game.time.events.add(500,function(){
            gameActive = true
            saturdayFeverNight(tutoPivot)
            if(!win){
                win = true
                theShining()
            }
        },this)
    }
    
    function danceTestTuto(choise){
        
        if(gameActive){

            game.add.tween(hand).to( { alpha: 0 }, 500, Phaser.Easing.Bounce.In, true, 0, 0);

            for(var b = 0; b < body.length; b++){
                allButtonsGroup.children[b].setAll('tint', 0x909090);
            }
            
            if(choise === tutoPivot){
                gameActive = false;
                saturdayFeverNight(5);
                sound.play('magic');
                tutoPivot++;
                
                game.time.events.add(3000,function(){
                    if(tutoPivot < 4){
                        initTuto();
                    }
                    else{
                        timerGroup.alpha = 1;
                        initGame();
                    }
                })
            }
        }
    }


    return {
        assets: assets,
        name: "dinamitaDance",
        localizationData: localizationData,
        preload:preload,
        update:update,
        getGameData:function () {
            var games = yogomeGames.getGames();
            return games[gameIndex];
        },
        create: function(event){

            sceneGroup = game.add.group();
            yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel);

            createBackground();

            danceSong = game.add.audio('danceSong');
            game.sound.setDecodedCallback(danceSong, function(){
                danceSong.loopFull(0.6)
            }, this);

            game.onPause.add(function(){
                game.sound.mute = true;
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false;
            }, this);

            initialize();

            initButtons();
            positionTimer();
            tnt();
            lightsOn();

            createTutorial();
            createHearts();
            createPointsBar();
            createCoin();

            particleCorrect = createPart("star");
            sceneGroup.add(particleCorrect);

            particleWrong = createPart("smoke");
            sceneGroup.add(particleWrong);
            
            buttons.getButton(danceSong,sceneGroup);
        }       
    }
}()