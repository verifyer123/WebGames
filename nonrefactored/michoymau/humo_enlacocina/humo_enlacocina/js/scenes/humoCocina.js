var soundsPath = "../../shared/minigames/sounds/"
var imagePath = "images/humoCocina/"
var humoCocina = function(){

	assets = {
        atlases: [                
			{
                name: "atlas.tutorial",
                json: imagePath + "tutorial/tutorial.json",
                image: imagePath + "tutorial/tutorial.png"
			},
            {
                name: "atlas.humoCocina",
                json: imagePath + "atlas.json",
                image: imagePath + "atlas.png",
			}
        ],
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
				file: soundsPath + "fireExplosion.mp3"},
			{	name: "shootBall",
				file: soundsPath + "shootBall.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"}
		],
	}
    
    var gameIndex = 1;
	var tile1, tile2, tile3;
	var buttonsGame = new Array;
	var sceneGroup = null;
	var heartsGroup = null;
	var nao, badguy;
    var pan;
    var smoke1, smoke2;
	var speedGame = 5;
	var heartsIcon;
	var heartsText;	
	var xpIcon;
	var xpText;
	var cursors;
	var leftMove = false;
	var rightMove = false;
	var lives = 3;
	var coins = 0;
	var bgm = null;
	var starGame = false;
	var pressDown = false;
	var pressUp = false;
    var naoGroup, smokeGroup, panGroup;
    var naoShape, smokeShape, panShape;
    var collisionNao = false;
    var limitMin;
    var limitMax;
    var complete = false;
    var velocity = 20;
    var enemyActive;
    var downButton;
    var activeButtonDown = false;
    var activeButtonUp = false;
    var reviewComic = false;
	var style = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	var styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"};

	function fontsSize(){
			if(game.world.width < 721){
				styleCards = {font: "2.5vh VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
			}else{
				styleCards = {font: "11vh VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
			}
	}
    function preload() {
        game.load.image('xpIcon',imagePath + "xpcoins.png");
        game.load.image('heartsIcon',imagePath + "hearts.png");
        game.load.image('gametuto',imagePath + "tutorial/gametuto.png");
        game.load.image('buttons',imagePath + "buttons.png");
		buttons.getImages(game);
        /*SPINES*/
        game.load.spine("nao", imagePath + "nao/nao.json");
        game.load.spine("badguy", imagePath + "badguy/badguy.json");
        game.load.spine("wilddentis", imagePath + "wilddentis/wild_dentist.json");
        /*COMIC*/
        game.load.image('comic1',imagePath + "comic/1.png");
        game.load.image('comic2',imagePath + "comic/2.png");
        game.load.image('comic3',imagePath + "comic/3.png");
        game.load.image('comic4',imagePath + "comic/4.png");
        game.load.audio('bgm',  soundsPath + 'songs/technology_action.mp3');
    }

	function loadSounds(){
		sound.decode(assets.sounds)
	}
    
	function initialize(){
		lives = 3;
		coins = 0;
		heartsText.setText("x " + lives);
		xpText.setText(coins);
		speedGame = 5;
		starGame = false;

	}	

	function getRandomArbitrary(min, max) {
  			return Math.floor(Math.random() * (max - min) + min);
	}
	
    function createComic(totalPages){
        var comicGroup = game.add.group();
        var comicrect = new Phaser.Graphics(game)
        comicrect.beginFill(0x131033)
        comicrect.drawRect(0,0,game.world.width *2, game.world.height *2);
        comicrect.alpha = 1;
        comicrect.endFill();
        comicrect.inputEnabled = true;
        comicGroup.add(comicrect);
        var arrayComic = new Array;
        
        for(var i= totalPages-1;i>=0;i--){
            arrayComic[i] = comicGroup.create(0,0,"comic" + [i+1]);
            arrayComic[i].x = game.world.centerX;
            arrayComic[i].anchor.setTo(0.5,0);
        }

        var counterPage = 0;
        var button1 = new Phaser.Graphics(game);
        button1.beginFill(0xaaff95);
        button1.alpha = 0;
        button1.drawRect(0,0,100, 70);
        button1.x = game.world.centerX - 50;
        button1.y = game.height - button1.height*1.4;
        button1.endFill();
        button1.inputEnabled = true;
        comicGroup.add(button1); 
        var button2 = new Phaser.Graphics(game);
        button2.beginFill(0xaaff95);
        button2.alpha = 0;
        button2.drawRect(0,0,100, 70);
        button2.x = game.world.centerX - button2.width*1.1;
        button2.y = game.height - button2.height*1.4;
        button2.endFill();
        button2.inputEnabled = true;
        comicGroup.add(button2);
        button2.visible = false;
        button1.events.onInputDown.add(function(){
            sound.play("pop");
            arrayComic[counterPage].alpha = 0;
            counterPage++;
                if(counterPage == 1){
                    button2.visible = true;
                    button1.x = button1.x + button1.width/1.5;
                }else{
                    if(counterPage == totalPages-1){
                        button2.visible = false;
                        button1.x = game.world.centerX - 50;
                        }else if(counterPage > totalPages-1){
                        game.add.tween(comicGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                                comicGroup.y = -game.world.height
                                createOverlay();
                                comicGroup.visible = false;
                                reviewComic = true;
                        });
                        }
                }  
        },this);        
        button2.events.onInputDown.add(function(){
            sound.play("pop");
            counterPage--;
            arrayComic[counterPage].alpha = 1;
                if(counterPage == 0){
                    button2.visible = false;
                    button1.x = game.world.centerX - 50;
                }
        },this);
        
        sceneGroup.add(comicGroup);
    }
    
	function createOverlay(){
		lives = 3;
		coins = 0;
		heartsText.setText("x " + lives);
		xpText.setText(coins);
		speedGame = 5;
		starGame = false;
		
        sceneGroup = game.add.group(); 
        yogomeGames.mixpanelCall("enterGame",gameIndex);
        overlayGroup = game.add.group();
        
		if(game.device != 'desktop'){
		    overlayGroup.scale.setTo(0.9,0.9);
		}else{
			overlayGroup.scale.setTo(1.2,1.2);
		}
		
        sceneGroup.add(overlayGroup)
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("pop");
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                overlayGroup.y = -game.world.height
		
		bgm = game.add.audio('bgm')
            game.sound.setDecodedCallback(bgm, function(){
            }, this);
		
		bgm.loopFull(0.5);
		starGame = true;
		buttons.getButton(bgm,sceneGroup)
				//TweenMax.to(readyButton,1,{y:game.height - readyButton.height,ease:Back.easeOut});		
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,"atlas.tutorial",'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.45,0.5);
		//plane.x = game.world.width * 0.55;
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'gametuto')
		tuto.anchor.setTo(0.4,0.5)
		
        
        var action = 'tap'
        
        if(game.device == 'desktop'){
            action = 'click'
        }
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 225,"atlas.tutorial",'howES')
		howTo.anchor.setTo(0.4,0.5)
		howTo.scale.setTo(0.7,0.7)
        
		var deviceName = 'pc'
		var offsetX = 0
        if(!game.device.desktop){
           deviceName = 'tablet'
			offsetX = 50
		  	var inputLogo = overlayGroup.create(game.world.centerX + offsetX,game.world.centerY + 145,"atlas.tutorial",'movil');
        	inputLogo.anchor.setTo(0.5,0.5);	 
        }else{
			var inputLogo = overlayGroup.create(game.world.centerX-40,game.world.centerY + 145,"atlas.tutorial",'pc');
        	inputLogo.anchor.setTo(0.2,0.5);	
		}
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height,"atlas.tutorial",'button')
		button.anchor.setTo(0.2,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,"atlas.tutorial",'playES')
		playText.anchor.setTo(0.1,0.5)
    }	
	
	function createHearts(){
		heartsGroup = game.add.group();
		heartsIcon = heartsGroup.create(0,0,"heartsIcon");
		heartsIcon.anchor.setTo(0, 0);	
		heartsIcon.x = game.world.width - heartsIcon.width;
		heartsIcon.y = 5;	
		heartsText = game.add.text(50, 10, "x " + lives, style,heartsGroup);	
		heartsText.anchor.setTo(0, 0);	
		heartsText.x = game.world.width - 75;
		heartsText.y = 5;
		sceneGroup.add(heartsGroup);
		
	}
	
	function createCoins(){
		coinsGroup = game.add.group();
		xpIcon = coinsGroup.create(0,0,"xpIcon");
		xpIcon.anchor.setTo(0, 0);	
		xpIcon.x = 0;
		xpIcon.y = 5;	
		xpText = game.add.text(50, 10, coins, style,coinsGroup);	
		xpText.anchor.setTo(0, 0);	
		xpText.x = 75;
		xpText.y = 2;	
		sceneGroup.add(coinsGroup);
	}	
	
	
	/*CREATE SCENE*/
    function createScene(){
        sceneGroup = game.add.group();
        naoGroup   = game.add.group();
        smokeGroup = game.add.group();
        panGroup   = game.add.group();
        cursors = game.input.keyboard.createCursorKeys();
		loadSounds();
        var backgroundColor = new Phaser.Graphics(game);
            backgroundColor.beginFill(0x400bad);
            backgroundColor.drawRect(0,0,game.world.width, game.world.height);
            backgroundColor.alpha = 1;
            backgroundColor.endFill();
            sceneGroup.add(backgroundColor);
        tile1 = game.add.tileSprite(0,game.world.centerY + 176,game.world.width, game.world.height/3,"atlas.humoCocina","tile_suelo");
		sceneGroup.add(tile1);        
        tile2 = game.add.tileSprite(0,0,game.world.width,736,"atlas.humoCocina","tile_cocina");
		sceneGroup.add(tile2);        
		tile3 = game.add.tileSprite(0,0,game.world.width,426,"atlas.humoCocina","tile_humo");
		sceneGroup.add(tile3); 
        nao = game.add.spine(game.world.centerX,game.world.centerY + (game.world.centerY/1.5) ,"nao");
        nao.scale.setTo(0.8);
        nao.setAnimationByName(0, "IDLE", true);
        nao.setSkinByName("normal");
        nao.x = game.world.centerX - nao.width/2;
        nao.posY = nao.y;
        nao.posX = nao.x;        
            naoGroup.add(nao);    
            sceneGroup.add(naoGroup);
        
        badguy = game.add.spine(game.world.centerX,game.world.centerY + 50,"badguy");
		badguy.setAnimationByName(0, "IDLE", true);
		badguy.setSkinByName("normal");
		badguy.x = game.width + badguy.width;
        badguy.scale.setTo(1);
        sceneGroup.add(badguy);
        

        
        pan = panGroup.create(0,0,"atlas.humoCocina","sarten");
        pan.x = 0;
        pan.y = game.world.centerY + pan.height/1.2;
        smoke1 = panGroup.create(pan.x,0,"atlas.humoCocina","humo1");
        smoke1.anchor.setTo(-1,0);
        smoke2 = panGroup.create(pan.x,0,"atlas.humoCocina","humo2");
        smoke2.anchor.setTo(-1,0.5);
        TweenMax.fromTo(smoke1,0.8,{alpha:1,y:pan.y+50},{alpha:0,y:pan.y-50,repeat:-1});
        TweenMax.fromTo(smoke2,1,{alpha:1,y:pan.y+50},{alpha:0,y:pan.y-50,repeat:-1});
        panGroup.x = game.width + panGroup.width
        sceneGroup.add(panGroup);
        
        var rectButtons = new Phaser.Graphics(game)
        rectButtons.beginFill(0x000000)
        rectButtons.drawRect(0,0,game.world.width, game.world.height/9);
        rectButtons.y = game.height - rectButtons.height;
        rectButtons.alpha = 0.7
        rectButtons.endFill();
        sceneGroup.add(rectButtons);
        
        var buttons = sceneGroup.create(0,0,"buttons");
        buttons.anchor.setTo(0.5,0.5);
        buttons.scale.setTo(0.8);
        buttons.x = game.world.centerX;
        buttons.y = game.height - buttons.height/1.7;
        downButton = new Phaser.Graphics(game)
        downButton.beginFill(0x38ff4f)
        downButton.drawRect(0,0,150, game.world.height/9);
        downButton.y = game.height - rectButtons.height;
        downButton.x = game.world.centerX + 10;
        downButton.alpha = 0
        downButton.endFill();
        downButton.inputEnabled = true;
        downButton.events.onInputDown.add(function(){
            activeButtonDown = true;
            downNao();
        },this);  
       downButton.events.onInputUp.add(function(){
           activeButtonDown = false;
           leaveNao();
       },this);
        sceneGroup.add(downButton);
        upButton = new Phaser.Graphics(game)
        upButton.beginFill(0x38ff4f)
        upButton.drawRect(0,0,150, game.world.height/9);
        upButton.y = game.height - rectButtons.height;
        upButton.x = game.world.centerX - upButton.width - 10;
        upButton.alpha = 0
        upButton.endFill();
        upButton.inputEnabled = true;
        upButton.events.onInputDown.add(function(){
            activeButtonUp = true;
            upNao();
        },this);  
       upButton.events.onInputUp.add(function(){
           activeButtonUp = false;
       },this);
        sceneGroup.add(upButton);
        
        limitMin = nao.x + nao.width;
        limitMax = nao.x - nao.width/4;
        console.log(limitMin)        
        console.log("limitMax:" + limitMax);
        enemyActive = getRandomArbitrary(0, 2);
		createHearts();
		createCoins();
        //starGame = true;
        if(!reviewComic){
            createComic(4);
        }else{
          createOverlay();  
        }
	}
    function leaveNao(){
            if(pressDown && !collisionNao){
	           nao.setAnimationByName(0, "IDLE", true);
               pressDown = false;
            }
    }
    
    function downNao(){
       if(!pressDown && !pressUp && !collisionNao){
               sound.play("shootBall");
	           nao.setAnimationByName(0, "DOWN", true);
               pressDown = true;
        } 
    }
    
    function upNao(){
                if(!pressUp && !collisionNao && !pressDown){
                       sound.play("whoosh");
	                   nao.setAnimationByName(0, "JUMP", true);
                        pressUp = true;
                        TweenMax.fromTo(nao,0.5,{y:nao.posY,x:nao.posX},{y:nao.posY-nao.height*2,x:nao.posX + 100,onComplete:downNao,delay:0.1});
                        function downNao(){
                            TweenMax.fromTo(nao,0.4,{y:nao.posY-nao.height*1.5},{y:nao.posY,onComplete:completeJump});
                        }
                            function completeJump(){
                                TweenMax.to(nao,1,{x:nao.posX});
                                if(!collisionNao){
                                   nao.setAnimationByName(0, "IDLE", true);
                                   }
                                pressUp = false;
                                }
                        }
    }

    
	function SumeCoins(){
            sound.play("magic");
	        coins++;
            xpText.setText(coins);
			nao.setAnimationByName(0, "WIN", true);
				
	}
	function gameOver(){
		var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,gameIndex)
			sceneloader.show("result");
	}


    
	function update() {

		if(starGame){	
            tile3.tilePosition.x -= 4;
			if(lives != 0){
                
                if(enemyActive == 0){
                    if(badguy.x > -(badguy.width*2)){
                        badguy.x -= velocity;
                    }else{
                        badguy.x = game.width + badguy.width*1.5;
                        complete = false;
                        collisionNao = false;
                        nao.setAnimationByName(0, "IDLE", true);
                        enemyActive = getRandomArbitrary(0, 2);
                    }
                }else{
                    if(panGroup.x > -(panGroup.width*2)){
                        panGroup.x -= velocity;
                    }else{
                        panGroup.x = game.width + panGroup.width*1.5;
                        complete = false;
                        collisionNao = false;
                        nao.setAnimationByName(0, "IDLE", true);
                        enemyActive = getRandomArbitrary(0, 2);
                    }
                }
                
                if(!collisionNao){
                    if( badguy.x < limitMin && badguy.x > limitMax-15){
                        if(pressDown){
                            if(badguy.x < limitMax + velocity){
                                if(!complete){
                                    SumeCoins(); 
                                    velocity = velocity + 1;
                                }
                                    complete = true;
                            }
                        }else{
                            sound.play("wrong");
                            collisionNao = true; 
                            lives--
                            heartsText.setText("x " + lives);
                            nao.setAnimationByName(0, "LOSESTILL", true);
                        }
                    }
                    if( panGroup.x < limitMin - panGroup.width/2 && panGroup.x > limitMax-15){
                        if(pressUp){
                            if(panGroup.x < limitMax + velocity){
                                if(!complete){
                                    SumeCoins(); 
                                    velocity = velocity + 1;
                                }
                                    complete = true;
                            }
                        }else{
                            sound.play("wrong");
                            collisionNao = true; 
                            lives--
                            heartsText.setText("x " + lives);
                            nao.setAnimationByName(0, "LOSESTILL", true);
                        }
                    }

                tile1.tilePosition.x -= 2;
                tile2.tilePosition.x -= 2;   
				if (cursors.down.isUp){
                    if(!activeButtonDown){
                        if(pressDown && !collisionNao){
                            nao.setAnimationByName(0, "IDLE", true);
                            pressDown = false;
                        }
                    }
				}
                
				if (cursors.down.isDown){
                    if(!pressDown && !pressUp && !collisionNao){
                        sound.play("shootBall");
	                   nao.setAnimationByName(0, "DOWN", true);
                        pressDown = true;
                    }
				}
                
				if (cursors.up.isUp){
                    
				}
                
				if (cursors.up.isDown){
                   if(!pressUp && !collisionNao && !pressDown){
                       sound.play("whoosh");
	                   nao.setAnimationByName(0, "JUMP", true);
                        pressUp = true;
                        TweenMax.fromTo(nao,0.5,{y:nao.posY,x:nao.posX},{y:nao.posY-nao.height*2,x:nao.posX + 100,onComplete:downNao,delay:0.1});
                        function downNao(){
                            TweenMax.fromTo(nao,0.4,{y:nao.posY-nao.height*1.5},{y:nao.posY,onComplete:completeJump});
                        }
                            function completeJump(){
                                TweenMax.to(nao,1,{x:nao.posX});
                                if(!collisionNao){
                                   nao.setAnimationByName(0, "IDLE", true);
                                   }
                                pressUp = false;
                                }
                        }
				    }
                }
			}else{
                starGame = false;
                bgm.stop();
                sound.play("gameLose");
				TweenMax.to(this,1,{alpha:0,onComplete:gameOver,delay:1});
            }
		}
	}
	return {
		assets: assets,
		name: "humoCocina",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()