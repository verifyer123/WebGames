var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/monsterDungeon/";

var monsterDungeon = function(){

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
			{	name: "falling",
				file: soundsPath + "falling.mp3"},
			{	name: "shootBall",
				file: soundsPath + "shootBall.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"},
			{	name: "splash",
				file: soundsPath + "splash.mp3"}
		],
	}
    
	
	sceneGroup = null;
	var gameIndex = 67;
	var speedGame = 5;
	var background;
	var heartsGroup = null;
	var heartsIcon;
	var xpIcon;
	var lives = 3;
	var cursors;
	var coins = 0;
	var activeGame = true;
    var NumbersArray = new Array;
    var answers = new Array;
     var options = new Array;
    var operatios = ["+","-"];
    var nameCandys = ["iceCream","cake","muffin"]; 
    var groupMonsters;
    var groupHands;
    var operation;
    var handleft;
    var handright;
    var candySelect;
    var smashSelect;
    var monster;
    var sume;
    var rest;
    var numberRandom;
    var answerOperation;
    var textOperation;
    var answerQuestion = null;
    
    
    
    	function getRandomArbitrary(min, max) {
  			return Math.floor(Math.random() * (max - min) + min);
	}
    
    
    function createOperation(){
        NumbersArray[0] = getRandomArbitrary(100, 450);
        NumbersArray[1] = getRandomArbitrary(0, 400);
        
        var choiceOperation = getRandomArbitrary(0, 2);
        if(choiceOperation == 0){
            sume = NumbersArray[0] + NumbersArray[1];
            textOperation = NumbersArray[0]+" " +operatios[0]+" " +NumbersArray[1] + " =";
            answers[0] = sume;
            answers[1] = sume + 50;
            answers[2] = sume + 20;
            answerOperation = sume;
            
        }else{
            if(NumbersArray[0] > NumbersArray[1]){
               rest = NumbersArray[0] - NumbersArray[1]; 
                textOperation = NumbersArray[0]+" " +operatios[1]+" " +NumbersArray[1] + " =";
            }else{
                rest = NumbersArray[1] - NumbersArray[0];
                textOperation = NumbersArray[1]+" " +operatios[1]+" " +NumbersArray[0] + " =";
            }
            
            answers[0] = rest;
            answers[1] = rest + 50;
            answers[2] = rest - 10;
            answerOperation = rest;
        }
        
        
    }
    
    
    createOperation();
    shuffle(answers);
	
	styleWhite = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
    styleOperations = {font: "65px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	styleBlack = {font: "80px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
	styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };

    function preload() {
		game.load.audio('sillyAdventureGameLoop',  soundsPath + 'songs/weLoveElectricCars.mp3');
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
		game.load.image("background1",imagePath + "background1.png");
        game.load.image("background2",imagePath + "background2.png");
        game.load.image("handleft",imagePath + "left.png");
        game.load.image("handright",imagePath + "right.png");   
        game.load.image("baseoperaciones",imagePath + "baseoperaciones.png");
        game.load.image("boton",imagePath + "boton.png");
        game.load.image("iceCream",imagePath + "iceCream.png");
        game.load.image("iceCream_smashed",imagePath + "iceCream_smashed.png");       game.load.image("cake",imagePath + "cake.png");
        game.load.image("cake_smashed",imagePath + "cake_smashed.png");       game.load.image("muffin",imagePath + "muffin.png");
        game.load.image("muffin_smashed",imagePath + "muffin_smashed.png");
        
		/*SPINE*/
		game.load.spine("Lizo", imagePath + "spine/Lizo/Lizo.json");
        game.load.spine("Mummy", imagePath + "spine/Mummy/mummy.json");
        game.load.spine("PigBot", imagePath + "spine/PigBot/pigbot.json");
        game.load.spine("SpiderOrb", imagePath + "spine/SpiderOrb/spiderorb.json");
        game.load.spine("TreeMower", imagePath + "spine/TreeMower/treemower.json");

		
		
		
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
        lives = 3
		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); ;
		loadSounds();
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		var background1 = game.add.tileSprite(0,0,game.width,game.height,"background1");
		sceneGroup.add(background1);
        
		var background2 = game.add.tileSprite(0,0,game.width,game.height,"background2");
		sceneGroup.add(background2);
    
  		var characters = ["Lizo","Mummy","PigBot","SpiderOrb","TreeMower"];

        groupMonsters = game.add.group();
        
        function createMonster(){
            shuffle(characters);
            monster = game.add.spine(0,0,characters[0]);
		    monster.y = game.world.centerY + 150;
		    monster.x = game.world.centerX;
		    monster.posx = monster.x;
            monster.setAnimationByName(0, "RUN", true);
            monster.setSkinByName("normal");  
            TweenMax.fromTo(monster,3,{y:monster.y - 100},{y:monster.y});
            TweenMax.fromTo(monster.scale,2,{x:0.3,y:0.3},{x:1,y:1,onComplete:monsterComplete});    
            
            function monsterComplete(){
                monster.setAnimationByName(0, "IDLE", true);
            }
            groupMonsters.add(monster);
            
        }
        

        createMonster();    

        groupHands = game.add.group();
        
        function posCandy(number){
        
            candySelect = groupHands.create(0,0,nameCandys[number]);
            candySelect.x = game.width - candySelect.width * 1.55; 
            candySelect.y = game.height - candySelect.height*2.1; 
            candySelect.posx = candySelect.x; 
            candySelect.posy = candySelect.y;   
            
            smashSelect = sceneGroup.create(0,0,nameCandys[number] + "_smashed");
            smashSelect.scale.setTo(0.5,0.5);
            smashSelect.alpha = 0;
            candySelect.scale.setTo(1,1);
            candySelect.alpha = 1;
            handleft = groupHands.create(0,0,"handleft");
            handleft.y = game.height - handleft.height/1.4;
            handleft.x = handleft.width/6;
            handleft.anchor.setTo(0.5,0.5);
            handright = groupHands.create(0,0,"handright");
            handright.y = game.height - handright.height;
            handright.x = game.width - handright.width/2.1;
            handright.anchor.setTo(0.3,0.5);
            
        }

        numberRandom = getRandomArbitrary(0, 3);
        
        posCandy(numberRandom);
 
        TweenMax.fromTo(groupHands,1,{y:groupHands.y - 20},{y:groupHands.y,repeat:-1,yoyo:true})
        
        sceneGroup.add(groupMonsters);
        sceneGroup.add(groupHands);

        var baseOperaciones = sceneGroup.create(0,0,"baseoperaciones");
        baseOperaciones.anchor.setTo(0.5,0.5);
        baseOperaciones.x = game.world.centerX;
        baseOperaciones.y = baseOperaciones.height;
        
        operation = game.add.text(0, 0, textOperation, styleOperations,sceneGroup);	
        operation.anchor.setTo(0.5,0.5);
        operation.x = game.world.centerX;
        operation.y = baseOperaciones.height;
    
        var optionGroup = game.add.group();
       
        
        for(i=1;i<=3;i++){
            options[i] = optionGroup.create(0,0,"boton");
            options[i].anchor.setTo(0.5,0.5);
            options[i].y = game.height - options[i].height/1.5;
            options[i].x = i * options[i].width*1.1;
            options[i].text = game.add.text(0,0,answers[i-1],styleWhite,optionGroup);
            options[i].text.anchor.setTo(0.5,0.5);
            options[i].text.x = options[i].x;
            options[i].text.y = options[i].y;
            options[i].answer = answers[i-1];
            options[i].inputEnabled = true;
            options[i].pressed = false;
            options[i].events.onInputDown.add(onPress,this);
        }
       
        
        function onPress(option){
                        for(i=1;i<=3;i++){
                    options[i].inputEnabled = false;
            }
            
            TweenMax.fromTo(option.scale,0.5,{x:1.5,y:1.5},{x:1,y:1});
            
            if(option.answer == answerOperation){
                answerQuestion = true;
                option.tint = 0x00ff31;
            }else{
                answerQuestion = false;
                option.tint = 0xff0000;
                option.pressed = true;
            }
            
            throwCandy();
        }
        
        function throwCandy(){

            sound.play("falling");
            TweenMax.to(handright,0.4,{x:handright.x + 50,y:handright.y - 100,ease:Back.easeIn,yoyo:true,repeat:1});
            
            TweenMax.fromTo(candySelect,0.5,{y:candySelect.posy,x:candySelect.posx-20},{y:candySelect.posy - 300,x:game.world.centerX,ease:Back.easeIn,onComplete:downCandy});
            TweenMax.fromTo(candySelect.scale,0.5,{x:1,y:1},{x:0.5,y:0.5,delay:0.5});
            
            function downCandy(){
                
                if(!answerQuestion){
                TweenMax.fromTo(candySelect,0.8,{y:candySelect.posy-300},{y:monster.y,ease:Strong.easeOut});  TweenMax.fromTo(candySelect,0,{alpha:1},{alpha:0,delay:0.3});  
                TweenMax.fromTo(smashSelect,0,{alpha:0},{alpha:1,delay:0.3,onComplete:badThrow});
                smashSelect.x = candySelect.x;
                smashSelect.y = monster.y; 
                    
                }else{
                  TweenMax.fromTo(candySelect,0.8,{y:candySelect.posy-300},{y:candySelect.posy-100,ease:Strong.easeOut}); 
                    TweenMax.fromTo(candySelect,0,{alpha:1},{alpha:0,delay:0.3,onComplete:goodThrow});
                    sound.play("magic");
                }
            }
            
            function badThrow(){
                monster.setAnimationByName(0, "HIT", true);
                lives--;
                heartsText.setText("x " + lives);
                sound.play("splash");
                if(lives != 0){
                TweenMax.fromTo(smashSelect,0.5,{alpha:1},{alpha:0,delay:2,onComplete:tryAgain});
                }else{
                    TweenMax.fromTo(sceneGroup,1,{alpha:1},{alpha:1,delay:1,onComplete:gameOver});
					sound.play("wrong");
					sound.play("gameLose");
					bgm.stop();	
                }
                
                
            }
            
            function goodThrow(){
                coins++;
                xpText.setText(coins);
                monster.setAnimationByName(0, "WIN", true);
                TweenMax.fromTo(candySelect,3,{alpha:0},{alpha:0,onComplete:nextMonster});
            }            
            
            function nextMonster(){
                TweenMax.to(background1.tilePosition,1,{x:background1.tilePosition.x-game.width}); 
                TweenMax.to(background2.tilePosition,1,{x:background2.tilePosition.x-game.width}); 
                TweenMax.to(monster,1,{x:monster.x-game.width,onComplete:newGame});
                
            }
            
            function tryAgain(){
                candySelect.destroy();
                smashSelect.destroy();
                handleft.destroy();
                handright.destroy();
                posCandy(numberRandom);
                monster.setAnimationByName(0, "IDLE", true);
                for(i=1;i<=3;i++){
                    if(!options[i].pressed)
                        options[i].inputEnabled = true;
                }
            }
            
            function newGame(){
                numberRandom = getRandomArbitrary(0, 3);
                monster.destroy();
                candySelect.destroy();
                smashSelect.destroy();
                handleft.destroy();
                handright.destroy();
                createMonster();
                posCandy(numberRandom);
                createOperation();
                shuffle(answers);
                operation.setText(textOperation);
                for(i=1;i<=3;i++){
                    options[i].inputEnabled = true;
                    options[i].tint = 0xffffff;
                    options[i].answer = answers[i-1];
                    options[i].text.setText(answers[i-1]);
                    options[i].pressed = false;
                }        
            }
            
        }
        
        
        function gameOver(){
		  var resultScreen = sceneloader.getScene("result")
			 resultScreen.setScore(true, coins,gameIndex)
			 sceneloader.show("result");
	   }	
        
        
        optionGroup.x = game.world.centerX - optionGroup.width/1.5;
        sceneGroup.add(optionGroup);
    
		createCoins(coins);
		createHearts(lives);
		createOverlay();
        lives = 3;
        heartsText.setText("x " + lives);
	}


	
	function update() {
		
	}
		

	
	
	return {
		assets: assets,
		name: "monsterDungeon",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()