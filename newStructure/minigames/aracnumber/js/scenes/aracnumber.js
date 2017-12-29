var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/aracnumber/";

var aracnumber = function(){

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
	
	var speedGame = 5;
	var background;
	var heartsGroup = null;
	var heartsIcon;
	//var heartsText;	
	var xpIcon;
	//var xpText;
	//var lives = 1;
	var cursors;
	var coins = 0;
	//var bgm = null;
	var activeGame = true;
    var gameIndex = 72;
    var fly1;
    var fly2;
    var textFly1;
    var textFly2;
    var multiples_5 = [];
    var multiples_10 = [];
    var multiples_100 = [];  
    var differentsMultiples = [100,10,5];
    var NumberSelect = 0;
    var activeMultiple = 100;
    var counter = 0;
    var spider;
    var lives;

	
	styleWhite = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	styleBlack = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
	styleSpider = {font: "70px VAGRounded", fontWeight: "bold", fill: "#FFF", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };

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
		game.load.image("background",imagePath + "background.png");
        game.load.image("arbusto_fondo",imagePath + "arbusto_fondo.png");
        game.load.image("arbustos",imagePath + "arbustos.png");
        game.load.image("cuerda",imagePath + "cuerda.png");
        game.load.image("rama",imagePath + "rama.png");
        game.load.image("ramas",imagePath + "ramas.png");
        game.load.image("web",imagePath + "web.png");
        game.load.image("star",imagePath + "star.png");
        game.load.image("wrong",imagePath + "wrong.png");

		/*SPINE*/
		game.load.spine("spider", imagePath + "spine/spider/spider.json");
        game.load.spine("fly", imagePath + "spine/fly/fly.json");

	}
    
    function multiple(valor, multiple)
                {
                    resto = valor % multiple;
                    if(resto==0)
                        return true;
                    else
                        return false;
                }        
    
        function multiples(max,Number,Array){       
        
                 for(var i=1;i<=max;i++)
                {

                    if(multiple(i,Number))
                        Array.push(i);
                }
            
            return Array
        }    

	function loadSounds(){
		sound.decode(assets.sounds)
	}
    
    function getRandomArbitrary(min, max) {
  		return Math.floor(Math.random() * (max - min) + min);
	}    
        
    
    
    function getSlotContainer (spineSkeleton, slotName) {
			var slotIndex
			for(var index = 0, n = spineSkeleton.skeletonData.slots.length; index < n; index++){
				var slotData = spineSkeleton.skeletonData.slots[index]
				if(slotData.name === slotName){
					slotIndex = index    
				}
			}

			if (slotIndex){     
				return spineSkeleton.slotContainers[slotIndex]
			}
		}    
	
	function initialize(){
		lives = 1;
		coins = 0;
		speedGame = 5;
		starGame = false;

	}	

	/*CREATE SCENE*/
    function createScene(){
		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
        
		loadSounds();
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);


        
        multiples(100,5,multiples_5)
        multiples(100,10,multiples_10)
        multiples(1000,100,multiples_100)
        
        //shuffle(multiples_100);
        
        console.log(multiples_5);
        console.log(multiples_10);
        console.log(multiples_100);
        
        
        
        
		var background = game.add.tileSprite(0,0,game.width,game.height,"background");
		sceneGroup.add(background);
         
        var groupBackground = game.add.group();
        
        var rama1 = groupBackground.create(0,0,"rama");
        rama1.anchor.setTo(0.3,0.5);
        rama1.y = game.world.centerY;
        
        var rama2 = groupBackground.create(0,0,"ramas");
        rama2.anchor.setTo(0.3,1);
        rama2.x = game.width - rama2.width/2;
        rama2.y = game.world.centerY;
        
        var arbusto_fondo = groupBackground.create(0,0,"arbusto_fondo");
        arbusto_fondo.anchor.setTo(0.5,0.5);
        arbusto_fondo.x = game.world.centerX;
        arbusto_fondo.y = game.height - arbusto_fondo.height/2;
        arbusto_fondo.width = game.width;
        
        sceneGroup.add(groupBackground);
        
        var arbustos = sceneGroup.create(0,0,"arbustos");
        arbustos.anchor.setTo(0.5,0.3);
        arbustos.x = game.world.centerX;
        
        var webSpider = sceneGroup.create(0,0,"web");
        webSpider.anchor.setTo(0.5,0.5);
        webSpider.x = game.world.centerX;
        webSpider.y = game.world.centerY;
        
        var spiderGroup = game.add.group();
        var cuerda = spiderGroup.create(0,0,"cuerda");
        cuerda.anchor.setTo(0.5,0);
        cuerda.x = game.world.centerX;
        cuerda.posx = cuerda.x;
        spider = game.add.spine(0,0,"spider");
        spider.setAnimationByName(0, "IDLE", true);
		spider.setSkinByName("normal");
        spider.x = game.world.centerX;
        spider.y = game.world.centerY + spider.height/1.5;
        spider.posx = spider.x;
        spiderGroup.add(spider);
        var textSpider = game.add.text(0, 0,activeMultiple, styleSpider,spiderGroup);
        textSpider.anchor.setTo(0.5,0.5);
        var slotNumberSpider = getSlotContainer(spider,"empty");
        slotNumberSpider.add(textSpider);

        spiderGroup.x = game.world.centerX - game.width/2;
        spiderGroup.posx = spiderGroup.x;
        
        sceneGroup.add(spiderGroup);
        TweenMax.fromTo(spiderGroup,2,{x:spiderGroup.posx - 20},{x:spiderGroup.posx + 10,yoyo:true,repeat:-1});
        
        
        var flyGroup1 = game.add.group();
        
        fly1 = game.add.spine(0,0,"fly");
        fly1.setAnimationByName(0, "IDLE", true);
		fly1.setSkinByName("normal");
        fly1.x = game.width/3 - fly1.width/2;
        fly1.y = -200;
        fly1.active = true;
        fly1.value = multiples_100[NumberSelect];
        flyGroup1.add(fly1);   
        textFly1 = game.add.text(0, 0,fly1.value, styleBlack,flyGroup1);
        textFly1.anchor.setTo(0.5,0.5);
        var slotNumberFly1 = getSlotContainer(fly1,"empty");
        slotNumberFly1.add(textFly1);

        sceneGroup.add(flyGroup1);
        
        var flyGroup2 = game.add.group();
        
        fly2 = game.add.spine(0,0,"fly");
        fly2.setAnimationByName(0, "IDLE", true);
		fly2.setSkinByName("normal");
        fly2.x = game.width - game.width/3 + fly2.width/2;
        fly2.posx = fly2.x;
        fly2.y = -200;
        fly2.active = true;    
        fly2.value = multiples_5[NumberSelect];
        flyGroup2.add(fly2);
        sceneGroup.add(flyGroup2);
        
        textFly2 = game.add.text(0, 0,multiples_100[NumberSelect], styleBlack,flyGroup2);
        textFly2.anchor.setTo(0.5,0.5);     
        var slotNumberFly2 = getSlotContainer(fly2,"empty");
        slotNumberFly2.add(textFly2);
        
        
        var star = sceneGroup.create(0,0,"star");
        star.anchor.setTo(0.5,0.5);
        star.alpha = 0;
        

        
       var buttonLeft = new Phaser.Graphics(game);
        buttonLeft.beginFill(0x000000)
        buttonLeft.drawRect(0,0,game.world.width/2, game.height)
        buttonLeft.alpha = 0
        buttonLeft.endFill()
        buttonLeft.inputEnabled = true;
        sceneGroup.add(buttonLeft);
        buttonLeft.events.onInputDown.add(function(){
            TweenMax.fromTo(spider,0.5,{x:spider.posx},{x:spider.posx - 100,onComplete:backSpider});
            TweenMax.fromTo(cuerda,0.5,{x:cuerda.posx},{x:cuerda.posx - 100});
            if(fly1.active){
                if(fly1.y >= eval(spider.y - spider.height/2) && fly1.y <= eval(spider.y + spider.height/2) ){
                    fly1.active = false;
                    fly2.active = false;
                    if(fly1.value == eval("multiples_"+activeMultiple)[NumberSelect]){
                        sound.play("magic");
                        TweenMax.to(fly2,0.5,{x:game.width+100});
                        TweenMax.to(fly1,0.5,{alpha:0});
                        TweenMax.to(fly1.scale,0.5,{x:1.2,y:1.2,onComplete:newFly1});
                        spider.setAnimationByName(0, "WIN", true);
                        star.x = fly1.x;
                        star.y = fly1.y;
                        TweenMax.fromTo(star,0.5,{alpha:1},{alpha:0});
                        TweenMax.fromTo(star.scale,0.5,{x:2,y:2},{x:4,y:4});
                        
                    }else{
                       
                        TweenMax.to(fly1,0.5,{x:-100});
                        TweenMax.to(fly2,0.5,{x:game.width+100});
                        lives--;
                        heartsText.setText("x " + lives);
                        spider.setAnimationByName(0, "LOSE", true); 
                        if(lives == 0){
                            TweenMax.to(fly1,0.5,{x:-100});
                            TweenMax.to(fly2,0.5,{x:game.width+100});
                            finishGame();
                        }else{
                            sound.play("wrong");
                            TweenMax.to(fly1,0.5,{x:-100});
                            TweenMax.to(fly2,0.5,{x:game.width+100,onComplete:newFly1});
                        }
                    }

                    
                    function newFly1(){
                        spider.setAnimationByName(0, "IDLE", true);
                        fly1.alpha = 1;
                        fly1.y = -200;
                        fly1.scale.setTo(1,1);
                        fly1.x = game.width/3 - fly1.width/2;
                        
                        fly1.active = true;
                        
                        fly2.alpha = 1;
                        fly2.y = -200;
                        fly2.scale.setTo(1,1);
                        fly2.x = fly2.posx;
                        
                        fly2.active = true;
                        
                        coins++;
                        xpText.setText(coins);
                        if(NumberSelect != eval("multiples_" + activeMultiple).length-1){
                            NumberSelect++;
                            choiceFly();
                        }else{
                            if(counter != 2){
                                counter = counter+1
                               activeMultiple = differentsMultiples[counter] 
                            }else{
                                counter = 0;
                                activeMultiple = differentsMultiples[counter];
                            }
                            NumberSelect = 0;
                            choiceFly();
                        }
                    }
                }
            }
        });
        
        function backSpider(){
            TweenMax.to(spider,1,{x:spider.posx,ease:Back.easeOut});
            TweenMax.to(cuerda,1,{x:spider.posx,ease:Back.easeOut});
        }
         /*buttonLeft.events.onInputUp.add(function(){
            TweenMax.to(spider,1,{x:spider.posx,ease:Back.easeOut});
            TweenMax.to(cuerda,1,{x:spider.posx,ease:Back.easeOut});
         });*/
        
       var buttonRight = new Phaser.Graphics(game);
        buttonRight.beginFill(0x000000)
        buttonRight.drawRect(game.world.centerX,0,game.world.width/2, game.height)
        buttonRight.alpha = 0
        buttonRight.endFill()
        buttonRight.inputEnabled = true;
        sceneGroup.add(buttonRight);
        buttonRight.events.onInputDown.add(function(){
            TweenMax.fromTo(spider,0.5,{x:spider.posx},{x:spider.posx + 100,onComplete:backSpider});
            TweenMax.fromTo(cuerda,0.5,{x:cuerda.posx},{x:cuerda.posx + 100});
            if(fly2.active){
                if(fly2.y >= eval(spider.y - spider.height/2) && fly2.y <= eval(spider.y + spider.height/2) ){
                    fly1.active = false;
                    fly2.active = false;
                    if(fly2.value == eval("multiples_"+activeMultiple)[NumberSelect]){
                        sound.play("magic");

                        TweenMax.to(fly1,0.5,{x:-100});
                        TweenMax.to(fly2,0.5,{alpha:0});
                        TweenMax.to(fly2.scale,0.5,{x:1.2,y:1.2,onComplete:newfly2});
                        spider.setAnimationByName(0, "WIN", true);
                        star.x = fly2.x;
                        star.y = fly2.y;
                        TweenMax.fromTo(star,0.5,{alpha:1},{alpha:0});
                        TweenMax.fromTo(star.scale,0.5,{x:2,y:2},{x:4,y:4});
                        
                    }else{
                       

                        lives--;
                        heartsText.setText("x " + lives);
                        spider.setAnimationByName(0, "LOSE", true); 
                        if(lives == 0){
                            TweenMax.to(fly1,0.5,{x:-100});
                            TweenMax.to(fly2,0.5,{x:game.width+100});
                            finishGame();
                        }else{
                            sound.play("wrong");
                            TweenMax.to(fly1,0.5,{x:-100});
                            TweenMax.to(fly2,0.5,{x:game.width+100,onComplete:newfly2});
                        }
                    }

                    
                    function newfly2(){
                        spider.setAnimationByName(0, "IDLE", true);
                        fly1.alpha = 1;
                        fly1.y = -200;
                        fly1.scale.setTo(1,1);
                        fly1.x = game.width/3 - fly1.width/2;
                        fly1.active = true;
                        fly2.alpha = 1;
                        fly2.y = -200;
                        fly2.scale.setTo(1,1);
                        fly2.x = fly2.posx;
                        fly2.active = true;
                        coins++;
                        xpText.setText(coins);
                        if(NumberSelect != eval("multiples_" + activeMultiple).length-1){
                            NumberSelect++;
                            choiceFly();
                        }else{
                            if(counter != 2){
                                counter = counter+1
                               activeMultiple = differentsMultiples[counter] 
                            }else{
                                counter = 0;
                                activeMultiple = differentsMultiples[counter];
                            }
                            NumberSelect = 0;
                            choiceFly();
                        }
                    }
                }
            }            
        });
        
         /*buttonRight.events.onInputUp.add(function(){
            TweenMax.to(spider,0.5,{x:spider.posx,ease:Back.easeOut});
            TweenMax.to(cuerda,0.5,{x:spider.posx,ease:Back.easeOut});
         });*/
        
        function choiceFly(){
            textSpider.setText(activeMultiple);
        var randomFly = getRandomArbitrary(1, 3);
            for(i=1;i<=2;i++){
                eval("fly" + i).value = Math.round(eval("multiples_"+activeMultiple)[NumberSelect]/2);
                eval("textFly" + i).setText(Math.round(eval("multiples_"+activeMultiple)[NumberSelect]/2));
            }
            
            eval("fly" + randomFly).value = eval("multiples_"+activeMultiple)[NumberSelect];
            eval("textFly" + randomFly).setText(eval("multiples_"+activeMultiple)[NumberSelect]);
            
            console.log("random: " + randomFly);
            console.log("NumberSelect: " + NumberSelect);
            console.log("fly1: " + fly1.value);
            console.log("fly2: " + fly2.value);
            if(speedGame < 30){
                speedGame = speedGame + 0.5;
            }
    }

    choiceFly();
        
        
        
        
        lives = 3;
        coins = 0;
		createCoins(coins);
		createHearts(lives);
		createOverlay();
        
        speedGame = 4;
        
        heartsText.setText("x " + lives);
      
		
	}
    
    
        function finishGame(){
            spider.setAnimationByName(0, "LOSE", true); 
            TweenMax.to(game,2,{alpha:0,onComplete:gameOver});
            sound.play("wrong");
            sound.play("gameLose");
            bgm.stop();	
            NumberSelect = 0;
            activeMultiple = 100;
            counter = 0;
        }	
	
		
		function gameOver(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,gameIndex)
			sceneloader.show("result");
		}     
    
        function tryAgainFly(){
            if(!starGame){
            sound.play("wrong");
            spider.setAnimationByName(0, "LOSE", true);     
            TweenMax.to(fly1,1,{alpha:1,onComplete:nextAnimation});
            function nextAnimation(){spider.setAnimationByName(0, "IDLE", true);  };
            fly1.y = -200;
            fly2.y = -200;    
            lives--;
            heartsText.setText("x " + lives);
            
                if(lives == 0){
                            finishGame();
                        }else{
                            starGame = true;
                        }
            }
        }

	
	function update() {
        
        
        
            if(starGame){
            if(fly1.y < game.height + fly1.height && fly1.active){
               fly1.y += speedGame; 
            }else if(fly1.y > game.height + fly1.height && fly1.active){
                starGame = false;
                tryAgainFly()
 
                
                
                
            }
        
            if(fly2.y < game.height + fly2.height && fly2.active){
               fly2.y += speedGame; 
            }else if(fly2.y > game.height + fly2.height && fly2.active){
                
                //starGame = false;
                //tryAgainFly()
                

            }
            }
            
	}
		

	
	
	return {
		assets: assets,
		name: "aracnumber",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()