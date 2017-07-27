var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/minmaxduel/";

var minmaxduel = function(){

	assets = {
        atlases: [                
			{
                //name: "atlas.bouncybath",
                //json: "images/bouncybath/atlas.json",
                //image: "images/bouncybath/atlas.png",
			}],
        images: [],
		sounds: [
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
            {	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "wrongItem",
				file: soundsPath + "wrongItem.mp3"},
            {	name: "break",
				file: soundsPath + "glassbreak.mp3"},
            {	name: "powerup",
				file: soundsPath + "powerup.mp3"},
            {	name: "balloon",
				file: soundsPath + "inflateballoon.mp3"},
			{	name: "explode",
				file: soundsPath + "explode.mp3"},
			{	name: "shootBall",
				file: soundsPath + "shootBall.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"}
		],
	}
    
	
	sceneGroup = null;
	barTimer = 30;
	coins = 0;	
	starGame = false;
	var speedGame = 5;
	var background;
	var heartsGroup = null;
	var heartsIcon;
	var heartsText;	
	var xpIcon;
	var lives = 1;
	var cursors;
	var gameIndex = 46;
	var bgtimer;
	var cardsArray;
	var dashedcard;
	
	styleWhite = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	styleBlack = {font: "80px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
	styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
	styleCards = {font: "70px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};

    function preload() {
		game.load.audio('sillyAdventureGameLoop',  soundsPath + 'songs/sillyAdventureGameLoop.mp3');
		/*Default*/
		buttons.getImages(game);
		game.load.image("heartsIcon", imagePath +"hearts.png");
		game.load.image("xpIcon", imagePath +"xpcoins.png");	
		game.load.image('buttonPlay',imagePath +"tutorial/button.png");		
		game.load.image('pc',imagePath +"tutorial/desktop.png");
		game.load.image('gametuto',imagePath +"tutorial/gametuto.png");
		game.load.image('introscreen',imagePath +"tutorial/introscreen.png");
		game.load.image('howTo',imagePath +"tutorial/how"  + localization.getLanguage()  + ".png");
		game.load.image('buttonText',imagePath +"tutorial/play" + localization.getLanguage() + ".png");
		
		/*GAME*/
		game.load.image("bgclock",imagePath + "bgclock.png");
		game.load.image("background",imagePath + "background.png");
		game.load.image("background2",imagePath + "background2.png");
		game.load.image("background3",imagePath + "background3.png");
		game.load.image("cards",imagePath + "cards.png");
		game.load.image("bluecard",imagePath + "bluecard.png");
		game.load.image("rosecard",imagePath + "rosecard.png");
		game.load.image("greencard",imagePath + "greencard.png");
		game.load.image("backcard",imagePath + "backcard.png");
		game.load.image("dashedcard",imagePath + "dashedcard.png");
		game.load.image("star",imagePath + "star.png");
		game.load.image("wrong",imagePath + "wrong.png");
		game.load.image("bgbar",imagePath + "bgbar.png");
		game.load.image("bar",imagePath + "bar.png");
		/*SPINE*/
		//game.load.spine("helicoptero", imagePath + "spine/helicoptero.json");

	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}
	
	function initialize(){
		lives = 1;
		coins = 0;
		speedGame = 5;
		starGame = false;

	}	

	/*CREATE SCENE*/
    function createScene(){
		var Numbers = [0,1,2,3,4,5,6,7,8,9];
		shuffle(Numbers);
		var optionsNumbers = [Numbers[0],Numbers[1],Numbers[2],Numbers[3]];
		var symbol;
		var symbolArray = ["<",">"];
		
		function selectAnswer(){
			console.log(optionsNumbers);
			for(i= 0;i<=optionsNumbers.length;i++){
				if(optionsNumbers[3] < optionsNumbers[i]){
					if(optionsNumbers[0] != 0){
						optionsNumbers[1] = optionsNumbers[0] - 1;	
					}
				}else{
					optionsNumbers[3] = optionsNumbers[0] + 1;
				}
			}
			
			
			symbolArray = ["<",">"];
			
			if(optionsNumbers[0] <= 3){
				symbol = symbolArray[0];
			}else{
				shuffle(symbolArray);
				symbol = symbolArray[0];
			};
		}

		selectAnswer();
		
		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex);;
		loadSounds();
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		var background = sceneGroup.create(0,0,"background");
		background.width = game.width;
		background.height = game.height;
		
		
		var background3 = sceneGroup.create(0,game.world.centerY,"background3");
		background3.width = game.width;
		background3.height = game.height/2;		

		
		
		var cards = sceneGroup.create(game.world.centerX,0,"cards");
		cards.y = game.world.centerY - cards.height/4
		cards.anchor.setTo(0.5,0.8);		
		
		
		var background2 = sceneGroup.create(0,0,"background2");
		background2.y = game.world.centerY - background2.height/2;
		background2.width = game.width;
		
		//card 1
		backcard1 = sceneGroup.create(0,0,"backcard");
		backcard1.x = game.world.centerX/2;
		backcard1.y = game.world.centerY + backcard1.height/1.8;
		backcard1.anchor.setTo(0.5,0.5);
		bluecard1 = sceneGroup.create(0,0,"bluecard");
		bluecard1.x = backcard1.x;
		bluecard1.y = backcard1.y;
		bluecard1.anchor.setTo(0.5,0.5);
		bluecard1.scale.setTo(0,1);
		textCard1 = game.add.text(bluecard1.x, bluecard1.y, optionsNumbers[0], styleCards,sceneGroup);
		textCard1.anchor.setTo(0.5,0.5);
		textCard1.scale.setTo(0,1);

		//card 2
		backcard2 = sceneGroup.create(0,0,"backcard");
		backcard2.x = game.world.centerX;
		backcard2.y = game.world.centerY + backcard2.height/1.8;
		backcard2.anchor.setTo(0.5,0.5);
		rosecard1 = sceneGroup.create(0,0,"rosecard");
		rosecard1.x = backcard2.x;
		rosecard1.y = backcard2.y;
		rosecard1.anchor.setTo(0.5,0.5);
		rosecard1.scale.setTo(0,1);
		textCard2 = game.add.text(rosecard1.x, rosecard1.y, symbol, styleCards,sceneGroup);
		textCard2.anchor.setTo(0.5,0.5);
		textCard2.scale.setTo(0,1);

		//card 3
		dashedcard = sceneGroup.create(0,0,"dashedcard");
		dashedcard.x = game.world.centerX/2 * 3;
		dashedcard.y = backcard2.y;
		dashedcard.anchor.setTo(0.5,0.5);
		dashedcard.answer = optionsNumbers[0];
		
		var bgbar = sceneGroup.create(0,0,"bgbar");
		bgbar.x = game.width/2 - bgbar.width/2;
		bgbar.y +=  bgbar.height*2; 
		bgbar.anchor.setTo(0,0.5);
		
		bar = sceneGroup.create(bgbar.x + 17,bgbar.y,"bar");
		bar.anchor.setTo(0,0.5);
		bar.scale.setTo(0,1);
		
		bgclock = sceneGroup.create(game.world.centerX,0,"bgclock")
		bgclock.anchor.setTo(0.5,0);
		
		
		shuffle(optionsNumbers);
		
		
		cardsArray = new Array;
		var groupCards =game.add.group();
		var centerAllCards = game.world.centerX - (backcard1.width*4 )/2.7;
		for(var p = 0;p<=3;p++){
			cardsArray[p] = groupCards.create(0,0,"bluecard");
			cardsArray[p].x = p * cardsArray[p].width + centerAllCards;
			cardsArray[p].y = game.height - cardsArray[p].height/2;
			cardsArray[p].anchor.setTo(0.5,0.5);
			cardsArray[p].answer = optionsNumbers[p];
			cardsArray[p].text = game.add.text(cardsArray[p].x, cardsArray[p].y, optionsNumbers[p], styleCards,groupCards);
			cardsArray[p].text.anchor.setTo(0.5,0.5);	
			ActiveDrag(cardsArray[p],dashedcard);
			cardsArray[p].events.onDragStop.add(function(currentSprite){
					  stopDrag(currentSprite,dashedcard);}, this);
		}
		
		sceneGroup.add(groupCards);
		
		
		var star = sceneGroup.create(0,0,"star");
		star.anchor.setTo(0.5,0.5);
		star.alpha = 0;
		
		var wrong = sceneGroup.create(0,0,"wrong");
		wrong.anchor.setTo(0.5,0.5);
		wrong.alpha = 0;	
		
		var select;
		

		
		
		function stopDrag(currentSprite, endSprite){	
			if (!this.game.physics.arcade.overlap(currentSprite, endSprite, function() {
			currentSprite.input.draggable = false;
			ActiveDisableCards(false);		
			TweenMax.to(currentSprite,0.4,{x:endSprite.x,y:endSprite.y});
				console.log(symbol);
				bgtimer.pause();
				if(symbol == "<"){
					if(endSprite.answer < currentSprite.answer){
						star.x = endSprite.x
						star.y = endSprite.y
						TweenMax.fromTo(star.scale,1,{x:1,y:1},{x:4,y:4});
						TweenMax.fromTo(star,1,{alpha:1},{alpha:0,onComplete:newGame});	
						select = currentSprite;
						sound.play("magic");
						coins++;
						xpText.setText(coins);
						
					}else{
						wrong.x = endSprite.x
						wrong.y = endSprite.y
						TweenMax.fromTo(wrong.scale,1,{x:1,y:1},{x:4,y:4});
						TweenMax.fromTo(wrong,1,{alpha:1},{alpha:0});	
						finishGame()
					}	
				}else{
					if(endSprite.answer > currentSprite.answer){
						star.x = endSprite.x
						star.y = endSprite.y
						TweenMax.fromTo(star.scale,1,{x:1,y:1},{x:4,y:4});
						TweenMax.fromTo(star,1,{alpha:1},{alpha:0,onComplete:newGame});	
						select = currentSprite;
						sound.play("magic");
						coins++;
						xpText.setText(coins);
					}else{
						
						wrong.x = endSprite.x
						wrong.y = endSprite.y
						TweenMax.fromTo(wrong.scale,1,{x:1,y:1},{x:4,y:4});
						TweenMax.fromTo(wrong,1,{alpha:1},{alpha:0});
						finishGame()
						
					}	
				}
	

				
		  })) { 
				TweenMax.to(currentSprite,1,{x:currentSprite.positionX,y:currentSprite.positionY});
		  }
		  }	

		

		
		
		function newGame(){
			TweenMax.to(backcard1.scale,1,{x:1,ease:Back.easeOut,delay:1});
			TweenMax.to(bluecard1.scale,1,{x:0,ease:Back.easeIn});
			TweenMax.to(textCard1.scale,1,{x:0,ease:Back.easeIn});
			TweenMax.to(backcard2.scale,1,{x:1,ease:Back.easeOut,delay:1});
			TweenMax.to(rosecard1.scale,1,{x:0,ease:Back.easeIn});
			TweenMax.to(textCard2.scale,1,{x:0,ease:Back.easeIn});		
			TweenMax.to(select,1,{x:select.positionX,y:select.positionY,onComplete:shuffleCards});
			select.input.draggable = true;
			ActiveDisableCards(true);
			function shuffleCards(){
				
				for(var s=0;s<=2;s++){
					TweenMax.to(cardsArray[s],0.5,{x:game.world.centerX});
				}
				TweenMax.to(cardsArray[3],0.5,{x:game.world.centerX,onComplete:nextnewGame});
			}
			function nextnewGame(){
				shuffle(Numbers);
				optionsNumbers = [Numbers[0],Numbers[1],Numbers[2],Numbers[3]];
				selectAnswer();
				textCard1.setText(optionsNumbers[0]);
				textCard2.setText(symbol);
				dashedcard.answer = optionsNumbers[0];
				
				TweenMax.to(backcard1.scale,1,{x:0,ease:Back.easeIn});
				TweenMax.to(bluecard1.scale,1,{x:1,ease:Back.easeOut,delay:1});
				TweenMax.to(textCard1.scale,1,{x:1,ease:Back.easeOut,delay:1});
				TweenMax.to(backcard2.scale,1,{x:0,ease:Back.easeIn});
				TweenMax.to(rosecard1.scale,1,{x:1,ease:Back.easeOut,delay:1});
				TweenMax.to(textCard2.scale,1,{x:1,ease:Back.easeOut,delay:1});
				shuffle(optionsNumbers);
				bar.scale.setTo(0,1);
				if(barTimer <= 5){
					barTimer = barTimer - 1;
				}
				bgtimer = TweenMax.to(bar.scale,barTimer,{x:1,onComplete:finishTime});
				for(var r=0;r<=3;r++){
					cardsArray[r].text.setText(optionsNumbers[r]);
					cardsArray[r].answer = optionsNumbers[r];
					TweenMax.to(cardsArray[r],0.5,{x:cardsArray[r].positionX});
				}
			}
				
			
		}
		
		
		
		
		
		createCoins(coins);
		createHearts(lives);
		createOverlay();

		
	}


	function finishGame(){
		TweenMax.to(game,1,{alpha:0,onComplete:gameOver});
		sound.play("wrong");
		sound.play("gameLose");
		bgm.stop();	
	}	
	
		
		function gameOver(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,gameIndex)
			sceneloader.show("result");
		}	
	
		function finishTime(){
			
			finishGame();
			ActiveDisableCards(false);
		}	
	
		function ActiveDisableCards(activar){
			for(var s=0;s<=3;s++){
				cardsArray[s].input.draggable = activar;
			}
		}	
	
	
	function update() {
		for(var p = 0;p<=3;p++){
			cardsArray[p].text.x = cardsArray[p].x;
			cardsArray[p].text.y = cardsArray[p].y;			
		}
		
		
		if(starGame){
			bgtimer = TweenMax.to(bar.scale,barTimer,{x:1,onComplete:finishTime});
			TweenMax.to(backcard1.scale,1,{x:0,ease:Back.easeIn});
			TweenMax.to(bluecard1.scale,1,{x:1,ease:Back.easeOut,delay:1});
			TweenMax.to(textCard1.scale,1,{x:1,ease:Back.easeOut,delay:1});
			TweenMax.to(backcard2.scale,1,{x:0,ease:Back.easeIn});
			TweenMax.to(rosecard1.scale,1,{x:1,ease:Back.easeOut,delay:1});
			TweenMax.to(textCard2.scale,1,{x:1,ease:Back.easeOut,delay:1});
			starGame = false;
		}

		
	}
	
	

	
	
	return {
		assets: assets,
		name: "minmaxduel",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()