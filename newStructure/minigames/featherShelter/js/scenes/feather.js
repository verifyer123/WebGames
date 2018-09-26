var soundsPath = "../../shared/minigames/sounds/"
var feather = function(){
    
    var localizationData = {
        "EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
            "stop":"Stop!"
        },

        "ES":{
            "howTo":"¿Cómo jugar?",
            "moves":"Movimientos extra",
            "stop":"¡Detener!"
        }
    }
    

    var assets = {
        atlases: [
            {   
                name: "atlas.feather",
                json: "images/feather/atlas.json",
                image: "images/feather/atlas.png",
            },
        ],
        images: [
            {   name:"background",
                file: "images/feather/fondo.png"},
            {   name:"tutorial_image",
                file: "images/feather/tutorial_image.png"}
        ],
        sounds: [
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "cut",
                file: soundsPath + "cut.mp3"},
            {   name: "wrong",
                file: soundsPath + "wrong.mp3"},
            {   name: "explosion",
                file: soundsPath + "laserexplode.mp3"},
            {   name: "pop",
                file: soundsPath + "pop.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "chicken",
                file: soundsPath + "chicken.mp3"},
            {   name: "wolf",
                file: soundsPath + "wolf.mp3"},
            {   name: "wolfSound",
                file: soundsPath + "wolfSound.mp3"},
            {   name: "inflateballoon",
                file: soundsPath + "inflateballoon.mp3"},
            {   name: "spaceSong",
                file: soundsPath + "songs/farming_time.mp3"}
            
        ],
        spritesheets:[
            {   name: "coin",
               file: "images/feather/coin.png",
               width: 122,
               height: 123,
               frames: 12
           },
           {   name: "hand",
               file: "images/feather/hand.png",
               width: 115,
               height: 111,
               frames: 23
           }
        ],
        spines:[
            {   name:"chick",
                file:"images/spines/Chick.json"},
            {   name:"wolf",
                file:"images/spines/wolf.json"}
        ]
    }
    
    var gameIndex = 37;
    var lives = null;
    var sceneGroup = null;
    var tutoGroup;
    var heartsGroup = null;
    var pointsBar;
    var coin;

    var background;
    var gameActive = true;
    var clouds, house;
    var spaceSong;
    var particleCorrect;   
    var particleWrong;
    var chickNumberText;
    var totalChicksContainer;

    var tutorial;
    var tutorialContainer;
    var tutorialText;
    var hand;
    var tutorialNumber;
    var tutorialIndex;
    var tutorialOperation;
    

    function loadSounds(){
        sound.decode(assets.sounds)
    }

    function initialize(){

        game.stage.backgroundColor = "#ffffff";
        lives = 3;//1;
        tutorialNumber = [2,0];
        tutorialIndex = 0;
        tutorialOperation = ["1+1=2", "2-1-1=0"];
        

        sceneGroup.alpha = 0;
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true);

        loadSounds();
        
    }

    function preload(){

        game.stage.disableVisibilityChange = false;

    }

    function stopGame(win){
        sound.play("wrong");
        gameActive = false;
        spaceSong.stop();
                
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 3750)
        tweenScene.onComplete.add(function(){
            
            var resultScreen = sceneloader.getScene("result");
            resultScreen.setScore(true, pointsBar.number,gameIndex);       
            sceneloader.show("result");
            sound.play("gameLose");
        });
    }

    function createTutorial(){

        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

    }

    function onClickPlay(rect){
            
        tutoGroup.y = -game.world.height;
        
        //numberChicks = game.rnd.integerInRange(2,5)
        tutorial = true;
        numberChicks = tutorialNumber[tutorialIndex];
        tutorialIndex++;
        sendChicks(numberChicks,true);

    }

    function update(){
        clouds.tilePosition.x += 0.4;
    }

    function createPointsBar(){
    
        pointsBar = game.add.group();
        pointsBar.x = game.world.width;
        pointsBar.y = 0;
        sceneGroup.add(pointsBar);

        var pointsImg = pointsBar.create(-10,10,'atlas.feather','xpcoins');
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

        var heartImg = group.create(0,0,'atlas.feather','life_box');

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

        particle.makeParticles('atlas.feather',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle

    }

    function createParticles(){
        particleCorrect = createPart('star');
        sceneGroup.add(particleCorrect);
        
        particleWrong = createPart('smoke');
        sceneGroup.add(particleWrong);
    }

    function popObject(obj,delay,appear, index){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut");
            if(appear){
                if(!tutorial){
                    obj.alpha = 1;
                    obj.children[0].inputEnabled = true;
                }else{
                    if(index == numberChicks-1 || (index == 9 && numberChicks == 0)){
                        obj.alpha = 1;
                        hand.x = obj.x;
                        hand.y = obj.y - 40;
                        hand.alpha = 1;
                        obj.children[0].inputEnabled = true;
                    }else{
                        obj.alpha = 0.6;
                        obj.children[0].inputEnabled = false;
                    }
                }
                game.add.tween(obj.scale).from({x:0, y:0},250,Phaser.Easing.linear,true);
            }else{
                game.add.tween(obj.scale).to({x:0,y:0},250,"Linear",true).onComplete.add(function(){
                    obj.scale.setTo(1,1);
                    obj.alpha = 0;
                })
            }
            
        },this);
    }
    
    function getChick(){
        
        for(var i = 0; i < chicksGroup.length;i++){
            
            var chick = chicksGroup.children[i]
            if(!chick.used){
                chick.used = true
                return chick
            }
        }
    }
    
    function sendChicks(number, isAdding){
        
        var delay = 0
        for(var i = 0; i < number; i++){
            
            var chick = getChick()
            chick.setAnimationByName(0,"RUN",true)
            
            goChick(chick,isAdding,delay)
            
            delay+= 500
        }
        
        delay+= 1500
        game.time.events.add(delay,function(){
            
            wolf.x = -200
            wolf.alpha = 1
            wolf.scale.x = 1
            
            wolf.setAnimationByName(0,"WALK",true)
            sound.play("wolf")
            game.add.tween(wolf).to({x:game.world.centerX - 150},1500,"Linear",true).onComplete.add(function(){
                wolf.setAnimationByName(0,"SIT",false)
                showButtons(true)
                gameActive = true
                if(tutorial){
                    tutorialText.setText(tutorialOperation[tutorialIndex-1]);
                    indicateChickTutorial(1, 250);
                }
            })
            
        })
    }
    
    function showButtons(appear){
        
        var delay = 0
        for(var i = 0; i < buttonsGroup.length;i++){
            
            var button = buttonsGroup.children[i];
            popObject(button,delay,appear,i);
            delay+= 100;
        }
    }
    
    function goChick(chick, isAdding, delay){
        
        var initialPosX = -100
        var posY = house.y + 35
        var toPosX = house.x 
        var numToUse = '+1'
        chick.scale.x = 1
        
        if(!isAdding){
            initialPosX = toPosX
            toPosX = -100
            numToUse = '-1'
            chick.scale.x = -1
        }
        
        game.time.events.add(delay, function(){
            
            sound.play("cut")
            
            chick.x = initialPosX
            chick.y = posY
        
            chick.alpha = 1
            
            if(!isAdding){
                throwChicken(numToUse,false);
            }
            
            game.add.tween(chick).to({alpha:1},250,"Linear",true)
            game.add.tween(chick).to({x:toPosX},2000,"Linear",true).onComplete.add(function(){
                game.add.tween(chick).to({alpha:0,y:chick.y - 50},250,"Linear",true)
                    
                chick.used = false
                
                
                if(isAdding){
                    throwChicken(numToUse,true);
                }
            })
        })
        
    }
    
    function throwChicken(numToUse, add){ 
        //createTextPart(numToUse,house)
        if(add){
            addNumberPart(house,'+1');
        }else{
            addNumberPart(house,'-1');
        }
        
        sound.play("chicken")

        var houseTween = game.add.tween(house.scale).to({x:1.25,y:1.25},100,"Linear",true,0,0)
        houseTween.yoyo(true,0)
    }

    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1;
    }

    function createBackground(){
        
        background = sceneGroup.create(0,-3,'background');
        background.width = game.world.width;
        background.height = game.world.height;
        
        var base = sceneGroup.create(0,game.world.height,'atlas.feather','base')
        base.anchor.setTo(0,1);
        base.width = game.world.width;
        
        clouds = game.add.tileSprite(0,100,game.world.width,191,'atlas.feather','clouds')
        sceneGroup.add(clouds);
        
        house = sceneGroup.create(game.world.centerX + 125, game.world.height - base.height * 0.75,'atlas.feather','grange')
        house.anchor.setTo(0.5,1);

        totalChicksContainer = game.add.group();
        totalChicksContainer.x = house.x - house.width/2 + 80;
        totalChicksContainer.y = house.y - house.height * 0.78;
        totalChicksContainer.width = 120;
        totalChicksContainer.height = 80;
        totalChicksContainer.alpha = 0;
        sceneGroup.add(totalChicksContainer);

        var box = game.add.sprite(0,0,'atlas.feather','box');
        totalChicksContainer.add(box);

        var chickCounter = game.add.sprite(25,totalChicksContainer.height/2 - 22,'atlas.feather','pollito1');
        chickCounter.scale.setTo(0.6,0.6);
        totalChicksContainer.add(chickCounter);

        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
        chickNumberText = new Phaser.Text(sceneGroup.game, 0, 18, "X 0", fontStyle);
        chickNumberText.x = 70;
        chickNumberText.y = totalChicksContainer.height/2 - 18;
        totalChicksContainer.add(chickNumberText);

        tutorialContainer = game.add.group();
        tutorialContainer.x = house.x - house.width/2 + 80;
        tutorialContainer.y = house.y - house.height * 0.78;
        tutorialContainer.width = 120;
        tutorialContainer.height = 80;
        tutorialContainer.alpha = 0;
        sceneGroup.add(tutorialContainer);

        var tutorialbox = game.add.sprite(0,0,'atlas.feather','box');
        tutorialContainer.add(tutorialbox);

        var tutorialfontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };
        tutorialText = new Phaser.Text(sceneGroup.game, 0, 0, tutorialOperation[tutorialIndex], tutorialfontStyle);
        tutorialText.setTextBounds(0, -8, 140, 80);
        tutorialContainer.add(tutorialText);

        hand = game.add.sprite(0, 0, "hand");
        hand.animations.add('hand');
        hand.animations.play('hand', 24, true);
        hand.alpha = 0;
    }
    
    function inputButton(obj){
        
        if(!gameActive){
            return
        }
        
        sound.play("pop");
        var parent = obj.parent;
        
        var tween = game.add.tween(parent.scale).to({x:0.7,y:0.7},200,"Linear",true,0,0);
        tween.yoyo(true,0);
        
        gameActive = false;

        if(obj.number == 10){
            obj.number = 0;
        }
        
        if(obj.number == numberChicks){
           
            if(tutorial){
                sound.play("magic");
            }else{
                addCoin(house);
            }
            particleCorrect.x = obj.world.x;
            particleCorrect.y = obj.world.y;
            particleCorrect.start(true, 1000, null, 5)
            
            wolf.setAnimationByName(0,"LOSE",false);
            sound.play("wolfSound");
            
            game.time.events.add(2000,hideObjects);
           
        }else{
            missPoint();
            particleWrong.x = obj.world.x;
            particleWrong.y = obj.world.y;
            particleWrong.start(true, 1000, null, 5);
            indicateChickCorrect();
           if(lives<1){
                game.time.events.add(1000,blowHouse);
           }else{
                sound.play("wolf");
                game.time.events.add(1000,hideObjects);
           }
        }
        
        changeButtons(0.6);

        if(tutorial){
            game.add.tween(hand).to( { alpha: 0}, 250, Phaser.Easing.Linear.InOut, true, 0, 0);
            indicateChickTutorial(0, 250);
            if(tutorialIndex > tutorialNumber.length-1){
                tutorial = false;
            }
        }
    }

    function indicateChickCorrect(){
        
        chickNumberText.setText("X " + numberChicks);
        chickNumberText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        totalChicksContainer.alpha = 1;
        totalChicksContainer.scale.setTo(1,1);
        game.add.tween(totalChicksContainer).to({alpha:0},1000,null,true,500);
        
    }

    function indicateChickTutorial(type, time){
         game.add.tween(tutorialContainer).to({alpha:type},time,null,true,500);
    }
    
    function changeButtons(alphaValue){
        for(var i = 0; i < buttonsGroup.length;i++){
            
            var button = buttonsGroup.children[i];
            button.alpha = alphaValue;
        }
    }
    
    function hideObjects(){
        
        wolf.scale.x = -1
        wolf.setAnimationByName(0,"WALK",true)
        
        game.add.tween(wolf).to({x:-125},1000,"Linear",true).onComplete.add(function(){
            
            showButtons(false)
            var number = numberChicks
            
            game.time.events.add(1000,function(){
                if(tutorial){
                    numberChicks = tutorialNumber[tutorialIndex];
                    sendChicks(number - numberChicks,false);
                    tutorialIndex++;
                    if(tutorialIndex > tutorialNumber.length-1){
                        numberChicks = 0;
                    }
                }else{
                    if((Math.random()*2 > 1 && (numberChicks > 2)) || numberChicks == 9){

                        numberChicks = numberChicks - game.rnd.integerInRange(1,numberChicks - 1);
                        sendChicks(number - numberChicks,false);
                    }else{
                        
                        numberChicks = numberChicks + game.rnd.integerInRange(1,9-numberChicks);
                        sendChicks(numberChicks - number,true);
                    }
                }
                //console.log(numberChicks + ' number ' + number)
            })
                        
        })  
    }
    
    function blowHouse(){
        
        wolf.setAnimationByName(0,"BLOW",false)
        sound.play("inflateballoon")
        
        game.time.events.add(500,function(){
            
            var wind = sceneGroup.create(wolf.x + 100,wolf.y - 50,'atlas.feather','wind')
            wind.anchor.setTo(0,0.5)

            game.add.tween(wind.scale).to({x:1.5,y:1.5},1000,"Linear",true)
            game.add.tween(wind).to({alpha:0},500,"Linear",true,500)
        
            game.add.tween(house).to({x:game.world.width + 200,y:house.y - 400,angle : 450},1500,"Linear",true)
            
            createPart('smoke',house)
        
            sound.play("chicken")
            
            for(var i = 0; i < numberChicks;i++){
                var chick = getChick()
                
                chick.x = house.x + 200 - (game.rnd.integerInRange(0,400))
                chick.y = house.y - 50 - game.rnd.integerInRange(0,-200)
                chick.alpha = 1
                
                game.add.tween(chick).to({x: game.world.width + 200, y: chick.y - game.rnd.integerInRange(0,400), angle: 360},1000,"Linear",true)
            }
        })
    }
    
    function createButtons(){
        
        buttonsGroup = game.add.group();
        sceneGroup.add(buttonsGroup);
        
        var pivotX = game.world.centerX - 220;
        var pivotY = game.world.height - 155;
        for(var i = 0; i < 10;i++){
            
            var group = game.add.group();
            group.x = pivotX;
            group.y = pivotY;
            group.alpha = 0;
            buttonsGroup.add(group);
            
            var image = group.create(0,0,'atlas.feather','numberbutton');
            image.anchor.setTo(0.5,0.5);
            image.inputEnabled = true;
            image.events.onInputDown.add(inputButton);
            image.number = (i+1);
            
            var fontStyle = {font: "45px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"};
            var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, i+1, fontStyle);
            pointsText.anchor.setTo(0.5,0.5);
            group.add(pointsText);
            
            if(i == 9){
                pointsText.setText(0);
            }
            
            pivotX+= group.width * 1.2;
            
            if((i+1) % 5 == 0){
                pivotY+= group.height * 1.1;
                pivotX = game.world.centerX - 227;
            }
            
        }
    }
    
    function createObjs(tag){
        
        var anim = game.add.spine(0,0,tag)
        anim.setSkinByName("normal")
        anim.setAnimationByName(0,"IDLE",true)
        return anim
    }
    
    function createChicks(){
        
        chicksGroup = game.add.group()
        sceneGroup.add(chicksGroup)
        
        for(var i = 0; i < 10; i++){
            var chick = createObjs("chick")
            chick.alpha = 0
            chick.used = false
            chicksGroup.add(chick)
        }
        
        wolf = createObjs("wolf")
        wolf.x = game.world.centerX - 200
        wolf.y = game.world.height - 250
        wolf.alpha = 0
        sceneGroup.add(wolf)
        
    }
    
    return {
        
        assets: assets,
        name: "feather",
        update: update,
        preload:preload,
        getGameData:function () { 
            var games = yogomeGames.getGames(); 
            return games[gameIndex];
        },
        create: function(event){
            
            sceneGroup = game.add.group(); 
            yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);

            initialize();
            spaceSong = sound.play("spaceSong", {loop:true, volume:0.6});
            
            createBackground();
            createButtons();
            createChicks();

            createHearts();
            createPointsBar();
            createCoin();
            createTutorial();
            createParticles();
            
            buttons.getButton(spaceSong,sceneGroup);
            
        }
    }
}()