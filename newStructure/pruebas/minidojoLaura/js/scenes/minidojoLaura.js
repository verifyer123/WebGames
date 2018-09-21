//#region Assets
var soundsPath = "../../shared/minigames/sounds/";

var minidojoLaura = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
		}
	}
    

	var assets = {
        atlases: [
            {   
                name: "atlas.basegame",
                json: "images/minidojoLaura/atlas.json",
                image: "images/minidojoLaura/atlas.png"
            },
            {
                name: "timeAtlas.basegame",
                json: "images/minidojoLaura/timeAtlas.json",
                image: "images/minidojoLaura/timeAtlas.png"
            }
        ],
        images: [
            {
                name: "background",
                file: "images/minidojoLaura/fondo.png"
            },
        	{   name:"tutorial_image",
                file: "images/minidojoLaura/gametuto.png"
            }
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "steam",
				file: soundsPath + "steam.mp3"},
			{	name: "zombieUp",
				file: soundsPath + "zombieUp.mp3"},
			{	name: "drag",
				file: soundsPath + "drag.mp3"},
			{	name: "gear",
				file: soundsPath + "gear.mp3"},
			{	name: "spaceSong",
                file: soundsPath + "songs/Japon.mp3"},
            {   name: "secret",
                file: soundsPath + "secret.mp3"}
		],
		spritesheets:[
            {   name: "coin",
               file: "images/minidojoLaura/coin.png",
               width: 122,
               height: 123,
               frames: 12
            },
            {   name: "hand",
               file: "images/minidojoLaura/hand.png",
               width: 115,
               height: 111,
               frames: 23
           }
        ],
		spines:[
            {
                name:"zombie",
                file:"images/spines/skeleton.json"
            }
        ]
    }
//#endregion

//#region DefaultFunctions
    var chSpMaster = null;
    var grpBoard = null;
    var grpPergamino = null;

    //Default
    var lives = 3;//null;
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
    var tweenClock;   

	function loadSounds(){
		sound.decode(assets.sounds);
	}

	function initialize(){
        
        game.stage.backgroundColor = "#ffffff";
        loadSounds();
        createBoard();
    }
    
	function preload(){

        game.stage.disableVisibilityChange = false;
        game.load.spine('master' , "images/spines/skeleton.json");
    }

    function stopGame(win){
        
		sound.play("wrong");
        gameActive = false;
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 3500);
		tweenScene.onComplete.add(function(){
            spaceSong.stop();
			var resultScreen = sceneloader.getScene("result");
			resultScreen.setScore(true, pointsBar.number,gameIndex);	
            sceneloader.show("result");
            sound.play("gameLose");
		});
    }

    function createTutorial(){
        tutoGroup = game.add.group();
        sceneGroup.add(tutoGroup);

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay);
    }

    function onClickPlay(){
    	tutoGroup.y = -game.world.height;

    }
    /*
    function update(){
    }*/

	function createPointsBar(){
        
        pointsBar = game.add.group();
        pointsBar.x = game.world.width;
        pointsBar.y = 0;
        sceneGroup.add(pointsBar);
        
        var pointsImg = pointsBar.create(-10,10,'atlas.basegame','xpcoins');
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
        
        sound.play("magic")
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

        var heartImg = group.create(0,0,'atlas.basegame','life_box');

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
        
        sound.play("wrong");
		        
        lives--;
        heartsGroup.text.setText('X ' + lives);
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true);
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true);
        })
        
        if(lives == 0){
            //stopGame(false);            
            gameActive = false;
            
            console.log("Fin del juego");
        }
        
        addNumberPart(heartsGroup.text,'-1');   
    }

    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.basegame',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle;
    }

    function createParticles(){
    	particleCorrect = createPart("star");
        sceneGroup.add(particleCorrect);

        particleWrong = createPart("smoke");
        sceneGroup.add(particleWrong);
    }
    //#endregion

    //#region CreateBoard
    function createBoard(){
        gameActive = true;

        createAndSetMaster();                
        sceneGroup.add(chSpMaster);
        grpBoard =  new Phaser.Group(game);

        setDecorationImage();        
        setPergamino();     
        createTimer();  
        setCardsOnBoard(); 
        loadBoard();                
        
        sceneGroup.add(grpBoard);
    }

    function loadBoard(){
        if (gameActive)
        {
            setPositonsAnswersOnBoard();            
            sound.play("secret");
            var tweenPergamino = game.add.tween(imgBoard.scale).to({x: 0.8, y: 0.8}, 1000, Phaser.Easing.Bounce.Out, true);
            tweenPergamino.onComplete.add(function(){
                createOperationToPlay();                
                showBoardAnimate(0);                
            });                                                       
        }        
    }    

    function setDecorationImage(){
        var imgDecoration = grpBoard.create(0,0,'atlas.basegame','board');
        imgDecoration.scale.setTo(1.3,1.3);//(0.8,0.8);
        imgDecoration.anchor.setTo(0.5,0.5);
        imgDecoration.x = game.world.centerX;// - 200;
        imgDecoration.y = game.world.centerY + 140;//150;
        
        sceneGroup.add(imgDecoration);
    }

    function createOperationToPlay(){
        var txtResult = null;

        getOperation();        

        if (twoOptions)
        {
            if (sumOperation)
                grpPergamino.add(setTextOpertation("+",-40,-170,fontBrown));
            else
                grpPergamino.add(setTextOpertation("-",-40,-175,fontBrown));//y170

            grpPergamino.add(setTextOpertation("=",75,-170, fontBrown));
            txtResult = setTextOpertation(answOp,125,-170,fontBrown);
            grpPergamino.add(txtResult);
            setSpaceQuestion(true);         
        }
        else
        {
            if (sumOperation)
            {
                grpPergamino.add(setTextOpertation("+",-78,-170,fontShortBrown));
                grpPergamino.add(setTextOpertation("+",10,-170,fontShortBrown));
            }
            else
            {
                grpPergamino.add(setTextOpertation("-",-78,-175,fontShortBrown));//y170
                grpPergamino.add(setTextOpertation("-",10,-175,fontShortBrown));
            }

            grpPergamino.add(setTextOpertation("=",100,-170, fontShortBrown));
            txtResult = setTextOpertation(answOp,135,-170,fontShortBrown);
            grpPergamino.add(txtResult);
            setSpaceQuestion(false); 
        }            
        setCorrectAnswerOnBoard();               
    }

    var posXTxtAnsw1; var posYTxtAnsw1; var posXTxtAnsw2; var posYTxtAnsw2; var posXTxtAnsw3; var posYTxtAnsw3;

    function setSpaceQuestion(twoSpaces){
        var space1; var space2; var space3;

        if (twoSpaces)
        {
            space1 = getImageUserAnswer(0.8, -95, -175);
            space2 = getImageUserAnswer(0.8, 15, -175);
            grpPergamino.add(space1);
            grpPergamino.add(space2);
        }
        else
        {            
            space1 = getImageUserAnswer(0.7,-123,-175);
            space2 = getImageUserAnswer(0.7,-34,-175);
            space3 = getImageUserAnswer(0.7,55,-175);
            grpPergamino.add(space1);
            grpPergamino.add(space2);
            grpPergamino.add(space3);

            posXTxtAnsw3 = space3.x;
            posYTxtAnsw3 = space3.y;
        }
        posXTxtAnsw1 = space1.x;
        posYTxtAnsw1 = space1.y;
        posXTxtAnsw2 = space2.x;
        posYTxtAnsw2 = space2.y;        
    }

    function getImageUserAnswer(scaleImg, addCenterX , addCenterY)
    {
        var imgSpace = grpBoard.create(0,0,'atlas.basegame', 'numFaltante');
        imgSpace.scale.setTo(scaleImg,scaleImg);//.8
        imgSpace.anchor.setTo(0.5,0.5);
        imgSpace.x = game.world.centerX + addCenterX;
        imgSpace.y = game.world.centerY + addCenterY;

        return imgSpace;
    }

    function getText(txtLabel, posX, posY, fontToUse){
        var txtCreate = game.add.text(game.world.centerX, game.world.centerY,txtLabel,fontToUse);

        txtCreate.anchor.setTo(0.5,0.5);
        txtCreate.x = posX;
        txtCreate.y = posY;

        return txtCreate;
    }

    function setTextOpertation(label, addX, addY, fontToUse){
        var text = game.add.text(game.world.centerX, game.world.centerY, label, fontToUse);

        text.anchor.setTo(0.5,0.5);
        text.x = game.world.centerX + addX;
        text.y = game.world.centerY + addY;//- 170;

        return text;
    }

    var fontShortBrown = {font: "40px Arial", fill: "#693713", align: "center"};
    var fontBrown = {font: "55px Arial", fill: "#693713", align: "center" /*backgroundColor: "#000000"*/};
    var fontShortWhite = {font: "40px Arial", fill: "#ffffff", align: "center"};
    var fontWhite = {font: "55px Arial", fill: "#ffffff", align: "center"};    

    var btnAllBoard = []; var txtBoardInGame = [];
    var imgBoard = null;

    function setCardsOnBoard(){
        var imgBtn = null;
        var dark = false;
        var posY = game.world.centerY;
        var txt; var iArrayTxt = 0;

        for (var y = 0; y < 3; y++){
            for(var x = 0; x < 3; x++){
                if (!dark){
                    imgBtn = grpBoard.create(0,0, 'atlas.basegame','panelClear');
                    //imgBtn = game.add.sprite(200,200,'atlas.basegame','panelClear');
                    txt = game.add.text(game.world.centerX, game.world.centerY, getRandomNumber(0,9), fontBrown);
                    grpBoard.add(txt);
                }                
                else{
                    imgBtn = grpBoard.create(0,0,'atlas.basegame','panelDark');
                    //imgBtn = game.add.sprite(200,200,'atlas.basegame','panelDark');
                    txt = game.add.text(game.world.centerX, game.world.centerY, getRandomNumber(0,9), fontWhite);
                    grpBoard.add(txt);
                }

                dark = !dark;
                imgBtn.scale.setTo(0.6,0.6);
                imgBtn.anchor.setTo(0.5,0.5);
                imgBtn.y = posY;
                txt.anchor.setTo(0.5,0.5);

                switch(x){
                    case 0:
                    imgBtn.x = game.world.centerX - 100;
                    break;
                    case 1:
                    imgBtn.x = game.world.centerX;
                    break;
                    case 2:
                    imgBtn.x = game.world.centerX + 100;
                    break;
                } 
                txt.x = imgBtn.x;
                txt.y = imgBtn.y;                             
                imgBtn.alpha = 0;   
                txt.alpha = 0;             
                imgBtn.events.onInputDown.add(setAnswerOnAnswerPlace,{indexAnswer: iArrayTxt});
                txtBoardInGame[iArrayTxt] = txt;
                btnAllBoard[iArrayTxt] = imgBtn;                
                iArrayTxt++;
            }
            posY += 100;
        }                        
    }  

    function setRandomNumber(){
        for (var i = 0; i < txtBoardInGame.length; i++){
            txtBoardInGame[i].text = (game.rnd.integerInRange(0,9));
        }
    }

    function showBoardAnimate(boardIndex){
        if (boardIndex < btnAllBoard.length){
            btnAllBoard[boardIndex].alpha = 1;            
            var tweenBoard = game.add.tween(btnAllBoard[boardIndex].scale).from({x: 0.01},250, Phaser.Easing.linear, true);
            sound.play("cut");
            tweenBoard.onComplete.add(function(){                
                txtBoardInGame[boardIndex].alpha = 1;                
                boardIndex++;
                showBoardAnimate(boardIndex);
            });
        }
        else
        {
            if (!tutorial)
            {
                enabledButtonsOnBoard();            
                tweenClock = game.add.tween(timerGroup.timeBar.scale).to({x: 0}, 10000, Phaser.Easing.linear, true);
                tweenClock.onComplete.add(function(){
                    missPoint();
                    tweenClock.stop();  
                    tweenClock = game.add.tween(timerGroup.timeBar.scale).to({x: 10.3}, 1500, Phaser.Easing.linear, true);                              
                    game.time.events.add(250,function(){
                        clearBoard();
                    },this);
                });
            }
            else            
                showTutorial();                                                      
        }
    }    

    function setPergamino(){
        imgBoard = grpBoard.create(0,0,'atlas.basegame','pergamino');
        imgBoard.scale.setTo(0,0);//(0.8,0.8);
        imgBoard.anchor.setTo(0.5,0.5);
        imgBoard.x = game.world.centerX;// - 200;
        imgBoard.y = game.world.centerY - 180;//150;
        
        sceneGroup.add(imgBoard);
        grpPergamino = new Phaser.Group(game);
        sceneGroup.add(grpPergamino);        
    }

    function createAndSetMaster(){
        chSpMaster = game.add.spine(game.world.centerX - 80, game.world.centerY - 180, "master");
        chSpMaster.scale.setTo(0.6,0.6);
        chSpMaster.setAnimationByName(0,"IDLE",true);
        chSpMaster.setSkinByName("normal");
    }

    function createTimer(){

        timerGroup = game.add.group();
        //timerGroup.alpha = 0
        sceneGroup.add(timerGroup);
        sceneGroup.bringToTop(timerGroup);
 
        var clock = timerGroup.create(game.world.centerX, 75, "timeAtlas.basegame", "clock");        
        clock.anchor.setTo(0.5);
        clock.scale.setTo(0.9,0.9);
        clock.x = game.world.centerX;
        clock.y = game.world.centerY - 95;
 
        var timeBar = timerGroup.create(clock.centerX - 155/*175*/, clock.centerY + 19, "timeAtlas.basegame", "bar");
        timeBar.anchor.setTo(0, 0.5);
        timeBar.scale.setTo(10.3,0.65);//(11.5, 0.65);
        timerGroup.timeBar = timeBar;        
   }
    //#endregion

    //#region GameLogic
    
    var sumOperation = false; var twoOptions = false; var tutorial = true;
    var op1 = 0; var op2 = 0; var op3 = 0; var answOp = 0;
    var answ1 = -1; var answ2 = -1; var answ3 = -1;
    var txtAnsw1 = null; var txtAnsw2 = null; var txtAnsw3 = null;
    var imgOutlines = [];
    var posAnsw1 = 0; var posAnsw2 = 0; var posAnsw3 = 0;

    function setAnswerOnAnswerPlace(){  
        
        sound.play("pop");
        btnAllBoard[this.indexAnswer].inputEnabled = false;

        if (answ1 == -1)
        {            
            answ1 = parseInt(txtBoardInGame[this.indexAnswer].text);//indexAnswer;
            if (twoOptions)
                txtAnsw1 = getText(answ1, posXTxtAnsw1, posYTxtAnsw1, fontWhite);
            else
                txtAnsw1 = getText(answ1, posXTxtAnsw1, posYTxtAnsw1, fontShortWhite);
            grpPergamino.add(txtAnsw1);              
            imgOutlines[0] = setOutlineOptionSelect(btnAllBoard[this.indexAnswer]);
            
            if (tutorial)            
                tutorialChangeOption(posAnsw1, posAnsw2);                                    
        }
        else
        {
            if (answ2 == -1)
            {
                answ2 = parseInt(txtBoardInGame[this.indexAnswer].text);//indexAnswer;
                if (twoOptions)
                    txtAnsw2 = getText(answ2, posXTxtAnsw2, posYTxtAnsw2, fontWhite);
                else
                    txtAnsw2 = getText(answ2, posXTxtAnsw2, posYTxtAnsw2, fontShortWhite);
                grpPergamino.add(txtAnsw2);                
                imgOutlines[1] = setOutlineOptionSelect(btnAllBoard[this.indexAnswer]);                
                if (twoOptions)
                    disableButtonsOnBoard(this.indexAnswer);                
                else
                {
                    if (tutorial)
                        tutorialChangeOption(posAnsw2, posAnsw3);
                }
            }else{
                answ3 = parseInt(txtBoardInGame[this.indexAnswer].text);                                
                txtAnsw3 = getText(answ3, posXTxtAnsw3, posYTxtAnsw3, fontShortWhite);
                grpPergamino.add(txtAnsw3);                
                imgOutlines[2] = setOutlineOptionSelect(btnAllBoard[this.indexAnswer]);
                disableButtonsOnBoard(this.indexAnswer);
            }                            
        }    
        darkColorButton(this.indexAnswer);
        game.add.tween(btnAllBoard[this.indexAnswer].scale).from({x: 0.3, y: 0.3},350, Phaser.Easing.linear, true);       
    }

    function setOutlineOptionSelect(spaceOnBoard){
        var imgOutline = grpBoard.create(0,0,'atlas.basegame','marco');
        imgOutline.anchor.setTo(0.5,0.5);
        imgOutline.scale.setTo(0.55,0.55);
        imgOutline.x = spaceOnBoard.x;
        imgOutline.y = spaceOnBoard.y;

        return imgOutline;
    }

    function darkColorButton(index){
        btnAllBoard[index].tint = 0x666666;
        txtBoardInGame[index].tint = 0x666666;
    }

    function enabledButtonsOnBoard(){
        for(var i = 0; i < btnAllBoard.length; i++){
            btnAllBoard[i].inputEnabled = true;
        }
    }

    function disableButtonsOnBoard(indexEndOperation){
        for(var i = 0; i < btnAllBoard.length; i++){            
            btnAllBoard[i].inputEnabled = false;
        }        
        checkResult(indexEndOperation);        
    }

    function checkResult(indexOp){
        var userResult = 0;
        var animation = "";

        if (twoOptions)
        {
            if (sumOperation)
                userResult = answ1 + answ2;
            else
                userResult = answ1 - answ2;
        }
        else
        {
            if (sumOperation)
                userResult = answ1 + answ2 + answ3;
            else
                userResult = answ1 - answ2 - answ3;
        }
        
        if (userResult === answOp){
            addCoin(btnAllBoard[indexOp]);            
            animation = "WIN";
        }
        else
        {
            missPoint();
            animation = "LOSE";
        }
        //chSpMaster.setMixByName(animation, "IDLE", 0.2); 
        chSpMaster.setAnimationByName(0,animation,false).onComplete = function(){                   
            clearBoard();
        };
        chSpMaster.addAnimationByName(0, "IDLE", true);       
        if (tweenClock != null)
            tweenClock.stop(); 
        
        tweenClock = game.add.tween(timerGroup.timeBar.scale).to({x: 10.3}, 1500, Phaser.Easing.linear, true);                 
    }

    function clearBoard(){        
        grpPergamino.removeAll();
        answ1 = -1;
        answ2 = -1;
        answ3 = -1;

        hideButtonsBoard();
        imgBoard.scale.setTo(0,0);
        clearOutlines();

        game.time.events.add(1500,function(){
            loadBoard();
        },this);

        clearColorButtonsBoard();

        if (tutorial)
        {
            tutorial = false;
            hand.destroy();
        }            
    }

    function hideButtonsBoard(){
        for (var i = 0; i < btnAllBoard.length; i++){
            btnAllBoard[i].alpha = 0;
            txtBoardInGame[i].alpha = 0;
        }
    }

    function clearOutlines(){
        for (var i = 0; i < imgOutlines.length; i++){
            imgOutlines[i].destroy();
        }
    }

    function getOperation(){
        answOp = 0;        
        
        if (game.rnd.integerInRange(0,1) === 1)   
            sumOperation = true;        
        else
            sumOperation = false;


        if (game.rnd.integerInRange(0,1) === 0) //2 operandos
        {
            twoOptions = true;            
            if (sumOperation)
            {
                op1 = game.rnd.integerInRange(1,9);
                op2 = game.rnd.integerInRange(1,9);
                answOp = op1 + op2;
                //console.log(op1 + " + " + op2 + " = " + answOp);
            }
            else
            {
                op1 = game.rnd.integerInRange(5,9);
                op2 = game.rnd.integerInRange(0,4);
                answOp = op1 - op2;
                //console.log(op1 + " - " + op2 + " = " + answOp);
            }            
        }
        else    //3 operandos
        {
            twoOptions = false;
            if (sumOperation)
            {
                op1 = game.rnd.integerInRange(1,9);
                op2 = game.rnd.integerInRange(1,9);
                op3 = game.rnd.integerInRange(1,9);
                answOp = op1 + op2 + op3;
                //console.log(op1 + " + " + op2 + " + " + op3 + " = " + answOp);
            }
            else
            {
                op1 = game.rnd.integerInRange(7,9);
                op2 = game.rnd.integerInRange(4,6);
                op3 = game.rnd.integerInRange(0,3);
                answOp = op1 - op2 - op3;
                //console.log(op1 + " - " + op2 + " - " + op3 + " = " + answOp);
            }
        }                
    }

    function setPositonsAnswersOnBoard(){
        posAnsw1 = getRandomNumber(0,8); 
        getIndexUnduplicaded(posAnsw1);
    }

    function setCorrectAnswerOnBoard(){          
        
        setRandomNumber();

        if (twoOptions)
        {
            if (txtBoardInGame[posAnsw1] != null && txtBoardInGame[posAnsw2] != null)
            {
                txtBoardInGame[posAnsw1].text = op1;
                txtBoardInGame[posAnsw2].text = op2;                
            }                        
        }
        else
        {            
            if (txtBoardInGame[posAnsw1] != null && txtBoardInGame[posAnsw2] != null && txtBoardInGame[posAnsw3] != null)
            {
                txtBoardInGame[posAnsw1].text = op1;
                txtBoardInGame[posAnsw2].text = op2;
                txtBoardInGame[posAnsw3].text = op3;                
            }           
        }                
    }   

    function getIndexUnduplicatedTwo(indexA, indexB){
        var unduplicValue = getRandomNumber(0, 8);
        
        if (unduplicValue != indexA && unduplicValue != indexB)
            posAnsw3 = unduplicValue;
        else
            getIndexUnduplicatedTwo(indexA, indexB);
    }

    function getIndexUnduplicaded(index){
        var value = getRandomNumber(0,8);

        if (value != index)
        {
            posAnsw2 = value;
            getIndexUnduplicatedTwo(posAnsw1, posAnsw2);
        }
        else
            getIndexUnduplicaded(index);
    }

    function getRandomNumber(min,max){
        var rndNumber = game.rnd.integerInRange(min,max);
        return rndNumber;
    }

    //#endregion

    //#region Tutorial

    function tutorialChangeOption(optOff, optOn){
        btnAllBoard[optOff].tint = 0x666666;
        txtBoardInGame[optOff].tint = 0x666666;
        btnAllBoard[optOn].tint = 0xffffff;
        txtBoardInGame[optOn].tint = 0xffffff;
        btnAllBoard[optOn].inputEnabled = true;
        setHandAnimatedTo(btnAllBoard[optOn]);
    }

    function showTutorial(){
        createHand();
        for (var i = 0; i < btnAllBoard.length; i++){
            if (i == posAnsw1)
            {
                btnAllBoard[posAnsw1].inputEnabled = true;
                setHandTo(btnAllBoard[posAnsw1]);
            }
            else
            {
                btnAllBoard[i].tint = 0x666666;
                txtBoardInGame[i].tint = 0x666666;
            }            
        }
    }

    function clearColorButtonsBoard(){
        for (var i = 0; i < btnAllBoard.length; i++){
            btnAllBoard[i].tint = 0xffffff;
            txtBoardInGame[i].tint = 0xffffff;
        }
    }

    function createHand(){        
        hand = game.add.sprite(0, 0, "hand");
        hand.animations.add('hand');
        hand.animations.play('hand', 24, true);        
        //hand.alpha = 0;
        //hand.x = game.world.centerX;
        //hand.y = game.world.centerY;
    }

    function setHandTo(objPosition){
        hand.x = objPosition.x;
        hand.y = objPosition.y;
    }

    function setHandAnimatedTo(posObject){
        tweenHand = game.add.tween(hand).to({ x: posObject.x, y: posObject.y }, 800, Phaser.Easing.Linear.In, true, 0, 0);
        tweenHand.onComplete.add(function(){
            tweenHand.stop();
        });
        //tweenHand.stop();
    }
    //#endregion

	return {
		
		assets: assets,
		name: "minidojoLaura",
		//update: update,
        preload:preload,
        getGameData:function () { 
        	var games = yogomeGames.getGames(); 
        	return games[gameIndex];
        },
		create: function(event){
            
            sceneGroup = game.add.group();
            
            var back = game.add.tileSprite(0,0, game.world.width, game.world.height,'background');//sceneGroup.create(0,0, 'background');
            sceneGroup.add(back);

			spaceSong = game.add.audio('spaceSong');
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.6);
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true;
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false;
            }, this);

            initialize();
                        			
            createHearts();
            createPointsBar();
            createCoin();
            //createTutorial();
            createParticles();
			
			buttons.getButton(spaceSong,sceneGroup);
            
		}
	}
}()