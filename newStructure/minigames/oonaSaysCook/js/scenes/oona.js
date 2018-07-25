var soundsPath = "../../shared/minigames/sounds/";

var oona = function(){
    
    var localizationData = {
        "EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
            "stop":"Stop!"
        },

        "ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!"
        }
    }
    
    assets = {
        atlases: [
            {   
                name: "atlas.oona",
                json: "images/oona/atlas.json",
                image: "images/oona/atlas.png",
            }

        ],
        images: [
            {
                name: "bricks",
                file: "images/oona/bricks.png"
            },
            {
                name: "tutorial_image",
                file: "images/oona/tutorial_image.png"
            }

        ],
        sounds: [
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "cut",
                file: soundsPath + "cut.mp3"},
            {   name: "wrong",
                file: soundsPath + "wrong.mp3"},
            {   name: "pop",
                file: soundsPath + "pop.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "drag",
                file: soundsPath + "drag.mp3"},
            {   name: "error",
                file: soundsPath + "error.mp3"},
            {   name: "right",
                file: soundsPath + "rightChoice.mp3"},
            {   name: "onnaSong",
                file: soundsPath + 'songs/wormwood.mp3'}
        ],
        spritesheets:[
            {   name: "coin",
               file: "images/oona/coin.png",
               width: 122,
               height: 123,
               frames: 12
            },
            {   name: "hand",
               file: "images/oona/hand.png",
               width: 115,
               height: 111,
               frames: 23
           }
        ],
        spines:[
            {
                name:"oonaAvatar",
                file:"images/spines/oona.json"
            }
        ]
    }

    var gameIndex = 98;
    var lives;
    var sceneGroup = null;
    var tutoGroup;
    var heartsGroup = null;
    var pointsBar;
    var coin;
    var particleCorrect;      
    var particleWrong;
    var hand;

    var onnaSong;
    var oonaAvatar;
    var board;
    var okBtn;
    var okBtnImg;
    var toolsTkn = ['mixTkn','pourTkn','cutTkn','ovenTkn','roastTkn','friedTkn'];
    var orders = ['mix','pour','cut','oven','roast','fried'];
    var animations = ['mix', 'percolate', 'cut', 'bake', 'stew', 'fry', 'lose'];
    //////var background;
    //var gameActive = true;
    //var cap;
    //var gameTime;
    //var toolsGroup;
    //var aux;
    //var storePos;
    //var inputAnswer = [];
    //var toolsArray = [];
    //var points;
    //var levelZeroRecipe;
    //var lzChangeHand;
    var buttosGroup;
    var recipeGroup;
    var answerGroup;
    var tweenSwipe;
    var tweenTime;
    var food;
    var foodIndex;
    var totalRecipeElements;
    var round;
    var buttonWidthWithSpace = 73.5;
    var levelZero;
    var levelZeroIndex;
    var correctAnswer = [0,1,2,3,4,5];
    var roundTime;
    
    function loadSounds(){
        sound.decode(assets.sounds)
    }

    function initialize(){

        game.stage.backgroundColor = "#ffffff";
        lives = 3;
        //aux = 0;
        //storePos = 0;
        //cap = 2;
        //gameTime = 15000;
        //inputAnswer = [cap];
        //toolsArray = [];
        //gameActive = false;
        //points = 0;
        //levelZeroRecipe = [];
        //lzChangeHand = false;

        totalRecipeElements = 2;
        round = 0;
        levelZero = true;
        levelZeroIndex = 0;
        roundTime = 15000;

        sceneGroup.alpha = 0;
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true);

        loadSounds();                               //Cargar siempre los sonidos

    }

    function preload(){

        game.stage.disableVisibilityChange = false;

    }

    function stopGame(win){
        
        gameActive = false;
        onnaSong.stop()

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
        startTutorial();
        //gameActive = true;
        //startTime();
    }

    function update() {
    }

    function createPointsBar(){

        pointsBar = game.add.group();
        pointsBar.x = game.world.width;
        pointsBar.y = 0;
        sceneGroup.add(pointsBar);

        var pointsImg = pointsBar.create(-10,10,'atlas.oona','xpcoins');
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

        addNumberPart(pointsBar.text,'+' + number,true);
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

    function addNumberPart(obj,number,isScore){

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

        var heartImg = group.create(0,0,'atlas.oona','life_box');

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

        addNumberPart(heartsGroup.text,'-1',true);
    }

    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.oona',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle;
    }

    function createBackground(){
        var fondo = sceneGroup.create(game.world.centerX, game.world.centerY, 'atlas.oona', "fondo");
        fondo.anchor.setTo(0.5, 0.5);
        fondo.width = game.world.width;
        fondo.height = game.world.height;    
        
        var bricks = sceneGroup.create(game.world.centerX, game.world.centerY, "bricks");
        bricks.anchor.setTo(0.5, 0.5);
        bricks.width = game.world.width; 
        bricks.height = game.world.height * 0.5;
        
        board = sceneGroup.create(0,0,'atlas.oona','board');
        board.scale.setTo(0.9, 0.9);
        board.anchor.setTo(0.5, 0.5);
        board.x = game.world.centerX;
        board.y = game.world.centerY - board.height * 0.52;
    }

    function createOona(){
        oonaAvatar = game.add.spine(game.world.centerX - 35, game.world.height, "oonaAvatar");
        oonaAvatar.scale.setTo(0.9, 0.9);
        oonaAvatar.setAnimationByName(0, "idle", true);
        oonaAvatar.setSkinByName("normal");
        sceneGroup.add(oonaAvatar);
        var slot = getSpineSlot(oonaAvatar, "empty");
        var imgFood = game.add.sprite(0,0, 'atlas.oona', "food_1");
        imgFood.anchor.setTo(0.5,0.5);
        slot.add(imgFood);
 
        okBtn = game.add.group();
        okBtn.x = game.world.centerX + 200;
        okBtn.y = game.world.height/2 + 38 ;// - 85;
        sceneGroup.add(okBtn);

        okBtnImg = okBtn.create(0, 0, 'atlas.oona', 'ok_01');
        okBtnImg.scale.setTo(0.35, 0.35);
        okBtnImg.anchor.setTo(0.5, 0.5);
        //okBtnImg.inputEnabled = true;
        //okBtnImg.events.onInputUp.add(cook)

        hand = game.add.sprite(0, 0, "hand");
        hand.animations.add('hand');
        hand.animations.play('hand', 24, true);
        hand.alpha = 0;
    }

    function addClickButtonOK(){
        okBtnImg.inputEnabled = true;
        okBtnImg.events.onInputDown.add(function(){
        
            game.add.tween(okBtn.scale).to({x:0.5, y:0.5}, 100, Phaser.Easing.linear, true).onComplete.add(function() 
            {
                game.add.tween(okBtn.scale).to({x: 1, y: 1}, 200, Phaser.Easing.linear, true);
            })
            sound.play("pop");
        })
    }

    function getSpineSlot(spine, slotName){
        
        var slotIndex;
        var n = spine.skeletonData.slots.length;
        for(var index = 0; index < n; index++){
            var slotData = spine.skeletonData.slots[index];
            if(slotData.name === slotName){
                slotIndex = index;
            }
        }

        if (slotIndex){
            return spine.slotContainers[slotIndex];
        }
    }

    function createTimeBar(){        
        timeGroup = game.add.group();
        timeGroup.x = game.world.centerX;
        timeGroup.y = 97;
        sceneGroup.add(timeGroup);
        
        var clock = timeGroup.create(0, 0, 'atlas.oona','clock');
        clock.y = - clock.height * 0.3;
        clock.anchor.setTo(0.5,0.5);
        
        var timeBar = timeGroup.create(0, 0, 'atlas.oona','bar');
        timeBar.scale.setTo(11.5, 0.7);
        timeBar.anchor.setTo(0,0.5);
        timeBar.x = clock.x - clock.width * 0.38;
        timeBar.y = clock.y + 20;
        timeGroup.time = timeBar;

    }

    function getRand(){
        var x = game.rnd.integerInRange(1, 4);
        if(x === foodIndex)
            return getRand();
        else
            return x;
    }

    function changeHand(index){
        if(levelZero){
            if(tweenSwipe!= null){
                tweenSwipe.stop();
            }
            hand.x = buttosGroup.x + buttonWidthWithSpace*correctAnswer[index];
            hand.y = buttosGroup.y;
            tweenSwipe = game.add.tween(hand).to( { y: hand.y + 100 }, 500, Phaser.Easing.Linear.InOut, true, 0, -1, true, 0);

            for(rev=0; rev<buttosGroup.length; rev++){
                if(buttosGroup.children[rev].number == correctAnswer[levelZeroIndex]){
                    activateButton(buttosGroup.children[rev]);
                }
            }
        }
    }

    function createAnswers(){
        buttosGroup.removeAll();
        answerGroup.removeAll();
        for(var ans = 0 ; ans < toolsTkn.length; ans++){
            var buttonAns = buttosGroup.create(buttonWidthWithSpace*ans,0,'atlas.oona', toolsTkn[ans]);
            buttonAns.scale.setTo(0.9, 0.9);
            if(!levelZero){
                buttonAns.inputEnabled = true;
                buttonAns.input.enableDrag();
                buttonAns.input.enableSnap(40, 40, false, true);  
            }
            buttonAns.number = ans;
            buttonAns.originPosX = buttonAns.x;
            buttonAns.originPosY = buttonAns.y;
            buttonAns.parentColocation = "original";
            //buttonAns.events.onInputUp.add(inputButton);
            buttonAns.events.onDragStop.add(fixLocation);
        }
        if(!levelZero){
            addClickButtonOK();
            okBtnImg.events.onInputUp.add(cook);
        }
    }

    function createSpaceQuestionAndAnswer(){
        recipeGroup = game.add.group();
        recipeGroup.x = game.world.centerX - board.width * 0.42;
        recipeGroup.y = board.y - 135;
        sceneGroup.add(recipeGroup);

        buttosGroup = game.add.group();
        buttosGroup.x = game.world.centerX - board.width * 0.45;
        buttosGroup.y = board.y - 43;
        sceneGroup.add(buttosGroup);

        answerGroup = game.add.group();
        answerGroup.x = game.world.centerX - board.width * 0.45;
        answerGroup.y = board.y + 75;
        sceneGroup.add(answerGroup);
    }

    function createQuestion(){
        Phaser.ArrayUtils.shuffle(correctAnswer);
        recipeGroup.removeAll();
        for(var re = 0 ; re < totalRecipeElements; re++){
            var recipe = recipeGroup.create(buttonWidthWithSpace*re,0,'atlas.oona', orders[correctAnswer[re]]);
            recipe.scale.setTo(0.9, 0.9);
            recipe.number = re;
        }
        createAnswers();
    }

    function fixLocation(item) {
        if(buttosGroup.length>0 && (item.y >=80 && item.y<=200)){
            sound.play("drag");
            buttosGroup.remove(item);
            answerGroup.add(item);
            colocationAnswer(item);
            item.parentColocation = "answer";
            if(levelZero && levelZeroIndex<totalRecipeElements-1){
                levelZeroIndex++;
                changeHand(levelZeroIndex);
            }else if(levelZero && levelZeroIndex==totalRecipeElements-1){
                tweenSwipe.stop();
                answerGroup.children[answerGroup.length-1].inputEnabled = false;
                hand.x = okBtn.x;
                hand.y = okBtn.y;
                addClickButtonOK();
                okBtnImg.events.onInputUp.add(cook);
            }
        }else if(item.parentColocation =="answer" && (item.y >=-200 && item.y<=-40)){
            answerGroup.remove(item);
            buttosGroup.add(item);
            colocationOriginal(item);
            item.parentColocation = "original";
            for(var g=0; g<answerGroup.length; g++){
                answerGroup.children[g].x = buttonWidthWithSpace*g;
            }
        }else if(item.parentColocation == "original"){
            colocationOriginal(item);
        }else{
            colocationAnswer(item);
        }
    }

    function colocationOriginal(itemCol){
        itemCol.x = itemCol.originPosX;
        itemCol.y = itemCol.originPosY;
        itemCol.newPos = -1;
    }

    function colocationAnswer(itemCol){
        if(itemCol.parentColocation =="answer"){
            itemCol.x = buttonWidthWithSpace*(itemCol.newPos);
            itemCol.y = 0;
        }else{
            itemCol.x = buttonWidthWithSpace*(answerGroup.length-1);
            itemCol.y = 0;
            itemCol.newPos = answerGroup.length-1;
        }
    }

    function startTutorial(){
        startTime();
        changeHand(levelZeroIndex);
    }

    function cook(){
        if(levelZero){
            game.add.tween(hand).to( { alpha:0 }, 300, Phaser.Easing.Linear.InOut, true, 0, 0);
            levelZero = false;
        }

        for(var ac = 0 ; ac < buttosGroup.length; ac++){
            buttosGroup.children[ac].inputEnabled = false;
        }
        for(var an = 0 ; an < answerGroup.length; an++){
            answerGroup.children[an].inputEnabled = false;
        }
        okBtnImg.events.onInputUp.removeAll();

        if(tweenTime!=null){
             tweenTime.stop();
        }
        var timer = 0;
        okBtnImg.inputEnabled = false;
        var result = false;
       
        for (var i = 0; i < totalRecipeElements; i++){
            if(answerGroup.children[i].number == correctAnswer[i]){
                animateOona(animations[correctAnswer[i]], timer);
                colorTools(timer, i, 0x00ff00);
                timer += 1000;
            }
            else {
                result = true;
                animateOona(animations[6], timer);
                colorTools(timer, i, 0xF63A3A);
                timer += 1000;
                break;
            }
        }
        
        game.time.events.add(timer,function(){
            endRound(result);
        },this);
    }

    function endRound(wasLost){
        
        if(timeGroup.tween != null){
            timeGroup.tween.stop();
        }
        
        if(wasLost){
            particleWrong.x = oonaAvatar.x + 150;
            particleWrong.y = oonaAvatar.y - oonaAvatar.height/2;
            particleWrong.start(true, 1000, null, 5);
            if(!levelZero){
                missPoint();
            }
        }else{
            var slot = getSpineSlot(oonaAvatar, "empty");
            foodIndex = getRand();
            slot.children[0].loadTexture('atlas.oona', "food_"+foodIndex);
            oonaAvatar.setAnimationByName(0, "good", false);
            oonaAvatar.addAnimationByName(0, "idle", true);
            particleCorrect.x = oonaAvatar.x + 150;
            particleCorrect.y = oonaAvatar.y - oonaAvatar.height/2;
            particleCorrect.start(true, 1000, null, 5);
            //Subir numero de elementos de receta
            if(totalRecipeElements == 2){
                totalRecipeElements++;
            }else{
                round++;
                console.log(round);
                if(round == 5){
                    console.log("Round:" + round + " totalRecipeElements:" + totalRecipeElements);
                    round = 0;
                    totalRecipeElements++;
                    if(totalRecipeElements==7){
                        totalRecipeElements--;
                        //Bajar tiempo
                        if(roundTime<=0){
                            roundTime = 1;
                        }else{
                            roundTime-=750;
                        }
                        console.log("Legue a limite" + totalRecipeElements);
                    }
                }
            }
            if(!levelZero){
                addCoin(oonaAvatar);
            }
        }

        game.time.events.add(500,function(){
            startTime();
        },this);
    }

    function activateButton(buttonToActive){

        for(var ac = 0 ; ac < buttosGroup.length; ac++){
            buttosGroup.children[ac].inputEnabled = false;
        }

        for(var an = 0 ; an < answerGroup.length; an++){
            answerGroup.children[an].inputEnabled = false;
        }

        buttonToActive.inputEnabled = true;
        buttonToActive.input.enableDrag();
        buttonToActive.input.enableSnap(40, 40, false, true);
    }

    function animateOona(action, delay){
        
        game.time.events.add(delay,function(){
            if(action == 'lose'){
                sound.play("error");
            }else{
                sound.play("right");
            }
            oonaAvatar.setAnimationByName(0, action, false);
            if(action == 'lose'){
                oonaAvatar.addAnimationByName(0, "idle", true);
            }
        },this);
    }
    
    function colorTools(delay, pos, color){     
        game.time.events.add(delay,function(){
            answerGroup.children[pos].tint = color;
        },this)
        
    }

    function startTime(){
        var timerInTime = 400 + (250*totalRecipeElements);
        timeGroup.time.scale.x = 11.5;

        createQuestion();
        
        game.time.events.add(timerInTime, function() 
        {
            if(!levelZero){
                tweenTime = game.add.tween(timeGroup.time.scale).to({x: 0}, roundTime, Phaser.Easing.linear, true);
            
                tweenTime.onComplete.add(function(){
                    oonaAvatar.setAnimationByName(0, 'lose', false);
                    oonaAvatar.addAnimationByName(0, 'idle', true);
                    endRound(true);
                });
            }
        }, this);
    }

    /*function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    }

    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }*/

    /*function inputButton(obj){

        if(gameActive && obj.pressed == false){
            inputAnswer[aux] = obj.parent.number
            
           if(aux == cap)
            {
                gameActive = false
            }

            obj.pressed = true
        }
    }
    
    function fixLocation(item) {
    
        sound.play("drag")

        if(levelZero){
            if(item.parent.number != correctAnswer[levelZeroIndex]){
                if (item.x >= 90 || item.x <= 90) {
                    item.x = 0;
                }
                item.y = 0;
                return;
            }else if(levelZeroIndex<cap-1){
                levelZeroIndex++;
                changeHand(levelZeroIndex);
            }else{
                hand.x = okBtn.x;
                hand.y = okBtn.y;
                tweenSwipe.stop();
                okBtnImg.events.onInputUp.add(cook);
            }
        }
        
        if (item.x >= 90 || item.x <= 90) {
            item.x = 0;
        }
        if(item.y <= -40){
            item.y = 0;
        }else if(item.y >= 40){
            item.y = 120;
            item.x = item.parent.number * -73 + storePos;       
            item.input.draggable = false;
            storePos += 73;
            aux++;
        }
    }*/
    
    // function startTime(){
        
    //     toolsGroup.alpha = 1;
    //     var timer = 400;

    //     enterRecipe();
    //     okBtnImg.inputEnabled = false;

    //     for (var i = 0; i < toolsGroup.length; i++)
    //     {
    //         popObject(toolsGroup.children[i], timer);
    //         toolsGroup.children[i].image.pressed = false;
    //         timer += 250;
    //     }
        
    //     game.time.events.add(timer, function() 
    //     {
    //         game.add.tween(recipeGroup).to({alpha: 1}, 200, Phaser.Easing.linear, true)
    //         gameActive = true;
    //         okBtnImg.inputEnabled = true;

    //         if(!levelZero){
    //             timeGroup.tween = game.add.tween(timeGroup.time.scale).to({x: 0}, gameTime, Phaser.Easing.linear, true)
            
    //             timeGroup.tween.onComplete.add(function() 
    //             {
    //                 oonaAvatar.setAnimationByName(0, 'LOSE', false);
    //                 endGame(true);
    //                 gameActive = false;
    //             });
    //         }
    //     }, this);
    // }
    
    // function endGame(timeEnded){
        
    //     if(timeGroup.tween != null){
    //         timeGroup.tween.stop();
    //     }
    //     okBtnImg.inputEnabled = false;
        
    //     if(timeEnded)
    //     {
    //         //oonaAvatar.setAnimationByName(0, "LOSE", false)
    //         particleWrong.x = oonaAvatar.x + 150;
    //         particleWrong.y = oonaAvatar.y - oonaAvatar.height/2;
    //         particleWrong.start(true, 1000, null, 5);
    //         if(!levelZero){
    //             missPoint();
    //         }
    //     }
    //     else
    //     {
    //         var slot = getSpineSlot(oonaAvatar, "empty");
    //         foodIndex = getRand();
    //         console.log(slot);
    //         slot.children[0].loadTexture('atlas.oona', "food_"+foodIndex);
    //         oonaAvatar.setAnimationByName(0, "good", false);
    //         particleCorrect.x = oonaAvatar.x + 150;
    //         particleCorrect.y = oonaAvatar.y - oonaAvatar.height/2;
    //         particleCorrect.start(true, 1000, null, 5);
    //         if(levelZero){
    //             levelZero = false;
    //         }else{
    //             points++;
    //             addCoin(oonaAvatar);
    //         }
    //     }
        
    //     oonaAvatar.addAnimationByName(0, "idle", true);
        
    //     gameActive = false;
    //     if(lives>0){   
    //         game.time.events.add(900, function() 
    //         {
    //             reloadElements()
    //         },this)
    //     }
    // }
    
    // function reloadElements(){
        
    //     for(var r = 0; r < cap; r++)
    //     {
    //         inputAnswer[r] = null
    //     }
        
    //     aux = 0
    //     storePos = 0
        
    //     toolsGroup.destroy()
    //     tools()
    //     recipeGroup.destroy()
    //     recipe()
        
    //     gameActive = true
        
    //     game.add.tween(timeGroup.time.scale).to({x: 12}, 300, Phaser.Easing.linear, true)
    //     startTime()
    // }
    
    /*function cook(){
        //console.log("Prees ok button")

        if(levelZero){
            game.add.tween(hand).to( { alpha: 0 }, 300, Phaser.Easing.Bounce.In, true, 0, 0);
        }

        for(var t =0; t < 6; t ++){
            toolsArray[t].inputEnabled = false
        }

        if(timeGroup.tween!=null){
            timeGroup.tween.stop();
        }
        var timer = 500;
        var fin = true;
        okBtnImg.pressed = true;
        okBtnImg.inputEnabled = false;
       
        if(aux == cap){
            gameActive = false;
            for (var i = 0; i < cap; i++)
            {
                if(inputAnswer[i] == correctAnswer[i]){
                    animateOona(animations[inputAnswer[i]], timer)
                    colorTools(timer, i, 0x00ff00) 
                    timer += 1000
                    fin = false
                }
                else {
                    animateOona(animations[6], timer)
                    colorTools(timer, i, 0xF63A3A)
                    timer += 1000
                    fin = true
                    break;
                }
            }
            animateOona('', timer)
            timer += 500    
        }else {
            animateOona(animations[6], timer)
            fin = true
        }
        
         game.time.events.add(timer,function(){
             endGame(fin)
         },this)
        
    }
    
    function animateOona(action, delay){
        
        game.time.events.add(delay,function(){
            
            switch(action){
                case 'mix':
                    sound.play("right")
                    oonaAvatar.setAnimationByName(0, action, false);
                    break;
                case 'percolate':
                    sound.play("right")
                    oonaAvatar.setAnimationByName(0, action, false);
                    break;
                case 'cut':
                    sound.play("right")
                    oonaAvatar.setAnimationByName(0, action, false);
                    break;
                case 'bake':
                    sound.play("right")
                    oonaAvatar.setAnimationByName(0, action, false);
                    break;
                case 'stew':
                    sound.play("right")
                    oonaAvatar.setAnimationByName(0, action, false);
                    break;
                case 'fry':
                    sound.play("right")
                    oonaAvatar.setAnimationByName(0, action, false);
                    break;
                case 'lose':
                    sound.play("error")
                    oonaAvatar.setAnimationByName(0, action, false);
                    break;
                default:
                    oonaAvatar.setAnimationByName(0, 'idle', true);
                    break;
            }
        },this)
    }
    
    function colorTools(delay, pos, color){
        
        game.time.events.add(delay,function(){
            if(toolsGroup.children[inputAnswer[pos]]!=null){
                toolsGroup.children[inputAnswer[pos]].image.tint = color;
            }
            
            if(toolsGroup.children[inputAnswer[pos]].image!= null){
                game.add.tween(toolsGroup.children[inputAnswer[pos]].image.scale).to({x:0.5, y:0.5}, 100, Phaser.Easing.linear, true).onComplete.add(function() 
                {
                    game.add.tween(toolsGroup.children[inputAnswer[pos]].image.scale).to({x: 0.9, y: 0.9}, 200, Phaser.Easing.linear, true)
                }); 
            }
            
        },this)
        
    }
    
    function recipe(){
        recipeGroup = game.add.group();
        recipeGroup.x = game.world.centerX - board.width * 0.35;
        recipeGroup.y = board.y - board.height * 0.3;
        sceneGroup.add(recipeGroup);
    }
    
    function enterRecipe(){
        
        recipeGroup.removeAll()
        Phaser.ArrayUtils.shuffle(correctAnswer);
        recipeGroup.alpha = 0

        if(!levelZero){
            if(!levelZero && points % 4 == 0 && cap < 6){
                cap++;
            }else if(cap >= 6){
                gameTime -= 1000;
            }
        }else{
            levelZeroIndex = 0;
            changeHand(0);
        }
        
        for(var r = 0; r < cap; r++)
        {
            var steps = game.add.group()
            recipeGroup.add(steps)
                        
            var stepsImg = steps.create(0, 0, 'atlas.oona', orders[correctAnswer[r]])
            stepsImg.scale.setTo(0.9, 0.9)
            stepsImg.anchor.setTo(0.5, 0.5)
            
            steps.x = r * 70;
        }
    }
     
    function tools(){
        toolsArray = []
        toolsGroup = game.add.group()
        toolsGroup.x =  game.world.centerX - board.width * 0.38;
        toolsGroup.y = board.y - 6
        sceneGroup.add(toolsGroup)
        
         for(var t = 0; t < 6; t++)
        {
            var tool = game.add.group()
            tool.alpha = 0
            toolsGroup.add(tool)
            
            var toolImg = tool.create(0, 0, 'atlas.oona', toolsTkn[t])
            toolImg.anchor.setTo(0.5, 0.5)
            toolImg.scale.setTo(0.9, 0.9)
            toolImg.inputEnabled = true
            toolImg.input.enableDrag()
            toolImg.input.enableSnap(40, 40, false, true);
            toolImg.events.onDragStop.add(fixLocation);
            //toolImg.events.onDragStart.add(onDragStart, this)
            //toolImg.events.onDragUpdate.add(onDragUpdate, this)
            toolImg.pressed = false
            toolImg.events.onInputUp.add(inputButton)
            
            tool.x = t * toolImg.width * 1.03
            tool.number = t
            tool.image = toolImg
            tool.originPosX = tool.x
            tool.originPosY = tool.y

            toolsArray.push(toolImg)
        }
    }*/
    
    // function onDragUpdate(obj, pointer, x, y) {
    //     var option = obj.parent
    //     obj.x = 0
    //     obj.y = 0
    //     option.x = x - option.deltaX
    //     option.y = y - option.deltaY
    // }
    
    // function onDragStart(obj, pointer) {
    //     var option = obj.parent
    //     option.deltaX = pointer.x - obj.world.x
    //     option.deltaY = pointer.y - obj.world.y
    // }

    /*function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
        },this)
    }*/

    return {
        assets: assets,
        name: "oona",
        preload:preload,
        update: update,
        getGameData:function () {
            var games = yogomeGames.getGames()
            return games[gameIndex]
        },
        create: function(event){

            sceneGroup = game.add.group();
            yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 

            game.onPause.add(function(){
                game.sound.mute = true;
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false;
            }, this);
   
            onnaSong = game.add.audio('onnaSong');
            game.sound.setDecodedCallback(onnaSong, function(){
                onnaSong.loopFull(0.6);
            }, this);

            sceneGroup.stage.backgroundColor = "#000000";
            createBackground(); 

            initialize();
            //tools();
            //recipe();
            createOona();
            createTimeBar();
            createSpaceQuestionAndAnswer();
            
            createHearts();
            createPointsBar();
            createCoin();
            createTutorial();

            particleCorrect = createPart("star");
            sceneGroup.add(particleCorrect);

            particleWrong = createPart("smoke");
            sceneGroup.add(particleWrong);
            
            buttons.getButton(onnaSong,sceneGroup);
        }       
    }
}()