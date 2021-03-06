var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/spaceCount/";
var tutorialPath = "../../shared/minigames/"

var spaceCount = function(){

	assets = {
        atlases: [                
			{
                name: "atlas.space",
                json: "images/spaceCount/atlas.json",
                image: "images/spaceCount/atlas.png"
			},
],
        images: [
            {
                name: "okBtn",
                file: "images/spaceCount/okBtn.png"
            }, 
            {
                name: "clock",
                file: "images/spaceCount/clock.png"
            }, 
            ],
		sounds: [
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "spaceship",
				file: soundsPath + "whoosh.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
            {	name: "inflateballoon",
				file: soundsPath + "inflateballoon.mp3"},
            {	name: "robotBeep",
				file: soundsPath + "robotBeep.mp3"},
            {	name: "balloon",
				file: soundsPath + "inflateballoon.mp3"},
			{	name: "explode",
				file: soundsPath + "explode.mp3"},
			{	name: "error",
				file: soundsPath + "error.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"},
            {	name: "wrongAnswer",
				file: soundsPath + "wrongAnswer.mp3"},
			{	name: "click",
				file: soundsPath + "click.mp3"}
		],
	}
    
	
	sceneGroup = null;

    var INITIAL_TIME = 5
	
	var speedGame = 5;
	var background;
	var heartsGroup = null;
	var heartsIcon;
	var xpIcon;
	var coins = 0;
	var lives = 3;
	var cursors;
    var losed;
	var activeGame = true;
    var gameIndex = 78;
    var activeMultiple = 4;
    var NumTaps = 0;
    var numberTime = INITIAL_TIME;
	var countComplete = 0;
    var bar;
    var buttonGame;
    var NumberTapText;
    var eagle;
    var star;
    var multipleBars = new Array;
    var typeShips = ["ship","ship1","ship2"];
    var counterText;
    var moreCoin;
    var currentTapIndex 
    var timerTween 
    var okBtn
    var inCount 
    
	styleWhite = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	styleBlack = {font: "80px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
	styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };

    function preload() {
		game.load.audio('sillyAdventureGameLoop',  soundsPath + 'songs/game_on.mp3');
		/*Default*/
		;
		game.load.image("heartsIcon", imagePath +"hearts.png");
		game.load.image("xpIcon", imagePath +"xpcoins.png");	
		game.load.image('buttonPlay',imagePath +"tutorial/button.png");		
		game.load.image('pc',imagePath +"tutorial/desktop.png");
		game.load.image('gametuto',imagePath +"tutorial/gametuto.png");
		/*game.load.image('introscreen',imagePath +"tutorial/introscreen.png");
		game.load.image('howTo',imagePath +"tutorial/how"  + localization.getLanguage()  + ".png");
		game.load.image('buttonText',imagePath +"tutorial/play" + localization.getLanguage() + ".png");*/
        
		game.load.image('star',imagePath + "star.png");
        game.load.image('wrong',imagePath + "wrong.png");
		/*GAME*/

        /*SPINE*/
		game.load.spine("eagle", imagePath + "spine/ship.json");

        game.load.image('tutorial_image',imagePath+"tutorial_image.png")
        //loadType(gameIndex)

		
		
		
	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}
	
	function initialize(){
		lives = 3;
		coins = 0;
		speedGame = 5;
        losed=false
		starGame = false;
        //console.log('initialize')
        numberTime = INITIAL_TIME
        currentTapIndex = 0
        inCount = false

	}	
    
    function getRandomArbitrary(min, max) {
  		return Math.floor(Math.random() * (max - min) + min);
	}   

	/*CREATE SCENE*/
    function createScene(){
        game.stage.disableVisibilityChange = false;
        game.onPause.add(function(){
            console.log("OnPause")
            game.sound.mute = true
        } , this);

        game.onResume.add(function(){
            game.sound.mute = false
        }, this);
		
        initialize()

		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
        
		loadSounds();
		//game.physics.startSystem(Phaser.Physics.P2JS);
		//game.physics.startSystem(Phaser.Physics.ARCADE);

		var background = sceneGroup.create(0,0,"atlas.space","fondo.png");
        background.width = game.width;
        background.height = game.height;
        
        var floor = sceneGroup.create(0,0,"atlas.space","base.png");
        floor.y = game.height - floor.height;
        floor.width = game.width;
        
        var counter = sceneGroup.create(0,0,"atlas.space","counter.png");
        counter.y = game.world.centerY - counter.height;
        counterText = game.add.text(0, 0,activeMultiple*10, styleWhite,sceneGroup);
        counterText.fontSize = "60px";
        counterText.y = counter.y + counterText.height/1.3;
        counterText.x = counter.width/3;
        
        eagle = game.add.spine(0,0,"eagle");
        eagle.setAnimationByName(0, "IDLE", true);
		eagle.setSkinByName(typeShips[getRandomArbitrary(0, 3)]);
        eagle.scale.setTo(2.5,2.5);
        eagle.y = game.height - eagle.height/1.8;
        eagle.x = game.world.centerX;
        sceneGroup.add(eagle);

       
        
        for(i=0;i<=9;i++){
            multipleBars[i] = new Array;
            
            multipleBars[i][0] = sceneGroup.create(0,0,"atlas.space","count_empty.png");
            multipleBars[i][0].x = game.width - multipleBars[i][0].width*1.5;
            multipleBars[i][0].y = (game.height-120) - multipleBars[i][0].height*1.1 * i;
            multipleBars[i][0].id = i;
            multipleBars[i][1] = sceneGroup.create(0,0,"atlas.space","count_right.png");
            multipleBars[i][1].anchor.setTo(0.5,0.5);
            multipleBars[i][1].x = multipleBars[i][0].x + multipleBars[i][1].width/2 + 33.5;
            multipleBars[i][1].y = multipleBars[i][0].y + multipleBars[i][1].height/2 + 3.5;
            
            multipleBars[i][1].alpha = 0;
            multipleBars[i][2] = sceneGroup.create(0,0,"atlas.space","count_wrong.png");
            multipleBars[i][2].anchor.setTo(0.5,0.5);
            multipleBars[i][2].x = multipleBars[i][0].x + multipleBars[i][2].width/2 + 33.5;
            multipleBars[i][2].y = multipleBars[i][0].y + multipleBars[i][2].height/2 + 3.5;
            multipleBars[i][2].alpha = 0;
        }
        
        
        var timeBar = sceneGroup.create(0,0,"clock");
        timeBar.anchor.setTo(0.5,0.5);
        timeBar.scale.setTo(0.8,0.8)
        timeBar.x = game.world.centerX;
        timeBar.y = timeBar.height*1.5;
        
        bar = new Phaser.Graphics(game);
        bar.beginFill(0x8cc63f)
        bar.drawRect(0,0,timeBar.width/1.33, timeBar.height/4);
        bar.x = game.world.centerX - timeBar.width/2.65;
        bar.y = timeBar.y + 5;
        bar.alpha = 1;
        bar.endFill()
        bar.scale.setTo(0,1);
        sceneGroup.add(bar);
        
        star = sceneGroup.create(0,0,"star");
        star.anchor.setTo(0.5,0.5);
        star.x = game.world.centerX;
        star.y = game.world.centerY;
        star.alpha = 0;
        
        buttonGame = new Phaser.Graphics(game);
        buttonGame.beginFill(0x000000)
        buttonGame.drawRect(0,0,game.world.width, game.height)
        buttonGame.alpha = 0
        buttonGame.endFill()
        buttonGame.inputEnabled = true;
       // buttonGame.input.priorityID = 2
        sceneGroup.add(buttonGame);
        buttonGame.events.onInputDown.add(function(){
            tap()
        });        

        /*okBtn = sceneGroup.create(game.world.centerX,game.world.centerY + 380,"okBtn");
        okBtn.anchor.setTo(0.5,0.5)
        okBtn.events.onInputDown.add(setOk)
        okBtn.inputEnabled = true;
       // okBtn.input.priorityID = 1
        okBtn.visible = false*/


        okBtn = game.add.group()
        okBtn.x = game.world.centerX
        okBtn.y = game.world.height - 85 
        okBtn.visible = false
        sceneGroup.add(okBtn)

        var okBtnImg = okBtn.create(0, 0, 'okBtn')
        okBtnImg.scale.setTo(0.7, 0.7)
        okBtnImg.anchor.setTo(0.5, 0.5)
        okBtnImg.inputEnabled = true
        okBtnImg.pressed = false
        okBtnImg.events.onInputUp.add(setOk)
        var text =""
        if(localization.getLanguage() == 'EN')
        {
            text = 'OK!'
        }
        else
        {
            text = '¡OK!'
        }

        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var okText = new Phaser.Text(sceneGroup.game, 0, 0, text, fontStyle)
        okText.x = okBtnImg.x
        okText.y = okBtnImg.y
        okText.anchor.setTo(0.5, 0.5)
        okBtn.add(okText)


        
        NumberTapText = game.add.text(0, 0, NumTaps + " taps", styleWhite,sceneGroup);
        NumberTapText.fontSize = "60px";
        NumberTapText.anchor.setTo(0.5,0.5);
        NumberTapText.x = game.world.centerX;
        NumberTapText.y = game.world.centerY;
        NumberTapText.alpha = 0;                          
        
        lives = 3;
		createCoins(coins);
		createHearts(lives);
		createOverlay();
       
        heartsText.setText("x " + lives);
        
        moreCoin = game.add.text(100, 20,"+1", styleWhite,sceneGroup);
        moreCoin.alpha = 0;


		
	}

    function setOk (){
        if(!inCount){
            console.log("onInputOk")
            timerTween.kill()
            completeTime()
        }
    }

    function tap(){
        NumTaps++;
        sound.play("click");
        if( !okBtn.visible ){
             okBtn.visible = true
        }
        

        if(NumTaps == 0 || NumTaps>10){
            sound.play("error");
            for(var p = 0; p<= 9;p++){
                TweenMax.fromTo(multipleBars[p][0],0.1,{alpha:0},{alpha:1,yoyo:true,repeat:10});
            }
            buttonGame.inputEnabled = false;
            lives--;
            timerTween.kill()
            sound.play("wrongAnswer");
            createHearts(lives);
            TweenMax.to(eagle,1,{x:-100,ease:Back.easeIn,delay:3,onComplete:newYogotar});
            eagle.setAnimationByName(0, "LOSE", true); 
            losed=true
            if(lives===0){
                finishGame()
            }
        }
            
        else{
            multipleBars[currentTapIndex][1].alpha = 1;
            TweenMax.fromTo(multipleBars[currentTapIndex][1].scale,1,{x:0,y:0},{x:1,y:1,ease:Elastic.easeOut,delay:0.2});
        }

        currentTapIndex++
    }
    
      function countTaps(){

        for(var i = 0 ; i < 10 ; i++){
            multipleBars[i][1].alpha = 0;
            multipleBars[i][2].alpha = 0;
        }
            TweenMax.to(buttonGame,0.3,{alpha:0});
            TweenMax.to(NumberTapText,0.3,{y:game.world.centerY+NumberTapText.height});
            TweenMax.to(NumberTapText,0.3,{alpha:0});            
            
            if(NumTaps == 0){
            sound.play("error");
                for(var p = 0; p<= 9;p++){
                    TweenMax.fromTo(multipleBars[p][0],0.1,{alpha:0},{alpha:1,yoyo:true,repeat:10});
                }                
                lives--;
                sound.play("wrongAnswer");
                createHearts(lives);
                TweenMax.to(eagle,1,{x:-100,ease:Back.easeIn,delay:3,onComplete:newYogotar});
                eagle.setAnimationByName(0, "LOSE", true); 
                losed=true
                
                if(lives===0){
                    finishGame()
                }
            }
            
          if(NumTaps > 10){
            sound.play("error");
                for(var p = 0; p<= 9;p++){
                    TweenMax.fromTo(multipleBars[p][2],0.1,{alpha:0},{alpha:1,yoyo:true,repeat:10});
                }
              timerTween.kill()
              lives--;
              sound.play("wrongAnswer");
              createHearts(lives);
              TweenMax.to(eagle,1,{x:-100,ease:Back.easeIn,delay:3,onComplete:newYogotar});
              eagle.setAnimationByName(0, "LOSE", true); 
              losed=true
                if(lives===0){
                    finishGame()
                }
              

          }else{
              sound.play("spaceship");
                for(var p = 0; p<= NumTaps-1;p++){
                    if(p > 9){
                        break;
                    }
                    
                    if(p > activeMultiple-1){
                        multipleBars[p][2].alpha = 1;
                        TweenMax.fromTo(multipleBars[p][2].scale,1,{x:0,y:0},{x:1,y:1,ease:Elastic.easeOut,delay:p*0.2,onComplete:animation});  
                        
                    }else{
                        multipleBars[p][1].alpha = 1;
                        TweenMax.fromTo(multipleBars[p][1].scale,1,{x:0,y:0},{x:1,y:1,ease:Elastic.easeOut,delay:p*0.2,onComplete:animation});
                    }                  
                }
            }
          
            function animation(){
                console.log("complete");
                if(countComplete == NumTaps-1){
                   
                        if(activeMultiple == NumTaps){
                            coins++;
                            xpText.setText(coins);
                            eagle.setAnimationByName(0, "WINSTILL", true);
                            TweenMax.fromTo(star.scale,3,{x:1,y:1},{x:3,y:3});
                            TweenMax.fromTo(star,1,{rotation:0},{rotation:10});
                            TweenMax.fromTo(star,1,{alpha:1},{alpha:0,delay:2});
                            TweenMax.to(eagle,1,{y:-100,ease:Back.easeIn,delay:4,onComplete:newYogotar});
                            sound.play("magic");
                            TweenMax.fromTo(moreCoin,1,{y:0,alpha:1},{y:25,alpha:0} );
                        }else{
                            console.log("incorrect");
                            sound.play("wrongAnswer");
                            lives--;
                            createHearts(lives);
                            TweenMax.to(eagle,1,{x:-100,ease:Back.easeIn,delay:3,onComplete:newYogotar});
                            eagle.setAnimationByName(0, "LOSE", true);
                            losed=true
                            if(lives===0){
                                finishGame()
                            }   
                        }
                   }else{
                       countComplete++
                   }
                
            }
            
        }               
        
        function newYogotar(){
            
            buttonGame.inputEnabled = true;
            sound.play("inflateballoon");
            okBtn.visible = false
            buttonGame.x = 0;
            bar.scale.setTo(0,1);
            eagle.setSkinByName(typeShips[getRandomArbitrary(0, 3)]);
            eagle.setAnimationByName(0, "IDLE", true);
            eagle.y = game.height - eagle.height/1.8;
            TweenMax.fromTo(eagle,2,{x:-100},{x:game.world.centerX,ease:Back.easeOut,delay:1,onComplete:newLevel});
            
            function newLevel(){
                for(i=0;i<=9;i++){
                    multipleBars[i][2].alpha = 0;
                    multipleBars[i][1].alpha = 0;
                }
                currentTapIndex = 0
                NumTaps = 0;
                countComplete = 0;
                activeMultiple = getRandomArbitrary(1, 11);
                counterText.setText(activeMultiple * 10);
                sound.play("robotBeep");
                TweenMax.fromTo(counterText.scale,0.5,{x:2,y:2},{x:1,y:1});
                if(numberTime >= 2.5 && !losed){
                    numberTime = numberTime - 0.25
                }else{
                    losed=false
                }
               timer(numberTime); 
               inCount = false
            }
            
        }
        
        
        function finishGame(){
            eagle.setAnimationByName(0, "LOSE", true); 
            TweenMax.to(game,2,{alpha:0,onComplete:gameOver});
            sound.play("wrongAnswer");
            sound.play("gameLose");
            bgm.stop();	
            NumTaps = 0;
            countComplete = 0;
            numberTime = INITIAL_TIME;
            heartsText.setText("x " + 0);
        }	
	
		
		function gameOver(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,gameIndex)
			sceneloader.show("result");
		}     

        function timer(time){
            timerTween = TweenMax.fromTo(bar.scale,time,{x:0},{x:1,ease:Linear.easeNone,onComplete:completeTime});
        }

        function completeTime(){
            inCount = true
            buttonGame.x = game.width;
            NumberTapText.setText(NumTaps + " taps");
            TweenMax.fromTo(NumberTapText,1,{y:game.world.centerY-NumberTapText.height},{y:game.world.centerY});
            TweenMax.fromTo(NumberTapText,1,{alpha:0},{alpha:1,onComplete:countTaps});
            sound.play("combo");
        }    
    
	
	function update() {
		if(!starGame){
            timer(numberTime);
        }
    
	}
		

	
	
	return {
		assets: assets,
		name: "spaceCount",
		preload: preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()