var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/luckynumber/";
var tutorialPath = "../../shared/minigames/"

var luckynumber = function(){

	assets = {
        atlases: [                
			{
                //name: "atlas.bouncybath",
                //json: "images/bouncybath/atlas.json",
                //image: "images/bouncybath/atlas.png",
			},

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
				file: soundsPath + "explode.mp3"},
			{	name: "shootBall",
				file: soundsPath + "shootBall.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"}
		],
	}
    
	
	sceneGroup = null;
	var gameIndex = 50;
	var speedGame = 5;
	var background;
	var heartsGroup = null;
	var heartsIcon;
    var ruletaGroup = null;
    var numberBlendMode = 5;
    var giro;
    var count = 0;
	var cursors;
    var xpIcon;
    var activeGame = true;
    var fractionPizza = new Array;
    var flechaRuleta;
	timer = 10;
	timerCount = null;
	starGame = true;
	lives = 3;
	coins = 0;
	heartsText = null;	
	xpText = null;
	bgm = null;


	
	styleWhite = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	styleBlack = {font: "60px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
	styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };

    function preload() {
		game.load.audio('sillyAdventureGameLoop',  soundsPath + 'songs/sillyAdventureGameLoop.mp3');
		/*Default*/
		;
		game.load.image('bgclock',imagePath + "bgclock.png");
		game.load.image("heartsIcon", imagePath +"hearts.png");
		game.load.image("xpIcon", imagePath +"xpcoins.png");	
		game.load.image('buttonPlay',imagePath +"tutorial/button.png");		
		game.load.image('desktop',imagePath +"tutorial/desktop.png");
		game.load.image('gametuto',imagePath +"tutorial/gametuto.png");
		/*game.load.image('introscreen',imagePath +"tutorial/introscreen.png");
		game.load.image('howTo',imagePath +"tutorial/how"  + localization.getLanguage()  + ".png");
		game.load.image('buttonText',imagePath +"tutorial/play" + localization.getLanguage() + ".png");*/
		/*GAME*/
		game.load.image("background",imagePath + "background.png");
		game.load.image("background2",imagePath + "background2.png");
		game.load.image("base",imagePath + "base.png");
		game.load.image("plato",imagePath + "plato.png");
		game.load.image("timbre_iddle",imagePath + "timbre_iddle.png");
		game.load.image("timbre_on",imagePath + "timbre_on.png");
		game.load.image("star",imagePath + "star.png");
		game.load.image("wrong",imagePath + "wrong.png");
        game.load.image("fracciones",imagePath + "fracciones.png");
        game.load.image("ruleta",imagePath + "ruleta.png");
        game.load.image("ruleta2",imagePath + "ruleta2.png");
        game.load.image("ruletaBase",imagePath + "ruletaBase.png");
        game.load.image("shadow",imagePath + "shadow.png");
        game.load.image("flecharuleta",imagePath + "flecharuleta.png");
		/*SPINE*/
		game.load.spine("stage", imagePath + "spine/stage.json");
        for(i=1;i<=9;i++){
           game.load.image("noveno" + i,imagePath + "novenos/noveno" + i + ".png"); 
        }

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
		starGame = false;

	}	
	
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};



	/*CREATE SCENE*/
    function createScene(){
        lives = 3;
		count = 0;
        giro = 2;
		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); ;
		loadSounds();
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		var background = game.add.tileSprite(0,0,game.width,game.height,"background");
		sceneGroup.add(background);
		
		var base = sceneGroup.create(0,0,"base");
		base.y = game.height - base.height;
		base.x = game.world.centerX - base.width/2;
        base.alpha = 0;

        var stage = game.add.spine(0,0,"stage");
		stage.setAnimationByName(0, "Animation", true);
		stage.setSkinByName("normal");
		stage.x = game.world.centerX;
        stage.y = game.world.centerY + 20;
        sceneGroup.add(stage);
		
        var fracciones = sceneGroup.create(0,0,"fracciones");
		fracciones.y = stage.y - stage.height/3.2;
		fracciones.x = game.world.centerX;
        fracciones.anchor.setTo(0.5,0.5);
        
        var ruletaBase = sceneGroup.create(0,0,"ruletaBase");
        ruletaBase.anchor.setTo(0.5,0.2);
        ruletaBase.x = game.world.centerX;
        ruletaBase.y = game.height - ruletaBase.height;
        
        var ruleta = sceneGroup.create(0,0,"ruleta");
        ruleta.anchor.setTo(0.5,0.3);
        ruleta.x = game.world.centerX;
        ruleta.y = game.height - ruleta.height;
		
		var plato = sceneGroup.create(0,0,"plato");
		plato.y = game.height - base.height - plato.height;
		plato.x = game.world.centerX - plato.width/2;
        plato.alpha =0;
		
		var fractions = [
			{fraction:"1/8",id:1},
			{fraction:"2/8",id:2},
			{fraction:"3/8",id:3},
			{fraction:"4/8",id:4},
			{fraction:"5/8",id:5},
			{fraction:"6/8",id:6},
			{fraction:"7/8",id:7},
			{fraction:"8/8",id:8},
			{fraction:"1/4",id:2},
			{fraction:"1/2",id:4}
		];
		//shuffle(fractions)
		

		var textGlobe = game.add.text(0, 0, fractions[0].fraction, styleBlack,sceneGroup);	
			textGlobe.anchor.setTo(0.5,0.5);
			textGlobe.setTextBounds(fracciones.x,fracciones.y,fracciones.width/4,fracciones.height/3);

		
		var numPizzas = 9;
		ruletaGroup = game.add.group();
        

        
		for(i=1;i<=numPizzas;i++){
			fractionPizza[i] = ruletaGroup.create(0,0,"noveno" + i);
			fractionPizza[i].anchor.setTo(0.5,1);
			fractionPizza[i].alpha = 0.2;
			fractionPizza[i].width = 180
			fractionPizza[i].angle = i * 45;
			fractionPizza[i].inputEnabled = true;
            game.physics.enable(fractionPizza[i] , Phaser.Physics.ARCADE);
			fractionPizza[i].over = false;
            fractionPizza[1].press = false;
        	
		}
        
        
        shadow = ruletaGroup.create(0,0,"shadow");
        shadow.anchor.setTo(0.5,0.5);
        ruletaGroup.x = ruleta.x;
        ruletaGroup.y = ruleta.y + ruletaGroup.height/4.5;
        ruletaGroup.scale.setTo(0.95,0.95);
        
        sceneGroup.add(ruletaGroup);
        
        var ruleta2 = sceneGroup.create(0,0,"ruleta2");
        ruleta2.anchor.setTo(0.5,0.3);
        ruleta2.x = game.world.centerX;
        ruleta2.y = game.height - ruleta.height;
        
		
		var star = sceneGroup.create(0,0,"star");
			star.scale.setTo(2);
			star.anchor.setTo(0.5,0.5);
			star.x = plato.x + plato.width/2;
			star.y = plato.y + plato.height/2;
			star.alpha= 0;
				
        
        flechaRuleta = sceneGroup.create(0,0,"flecharuleta");
        flechaRuleta.anchor.setTo(0,0);
        flechaRuleta.x = ruleta.x + ruleta.width/2 - flechaRuleta.width;
        flechaRuleta.posx = flechaRuleta.x;
        flechaRuleta.y = ruleta.y + flechaRuleta.height/2;

        
        timbre_iddle = new Phaser.Graphics(game)
        timbre_iddle.beginFill(0x000000)
        timbre_iddle.drawRect(0,0,game.world.width, game.world.height)
        timbre_iddle.alpha = 0;
        timbre_iddle.endFill();
        timbre_iddle.inputEnabled = true;
         game.physics.enable(timbre_iddle , Phaser.Physics.ARCADE);
        timbre_iddle.events.onInputDown.add(onPressBell,this);
		sceneGroup.add(timbre_iddle);
        
		function onPressBell(currentSprite,endSprite){
           
            TweenMax.fromTo(flechaRuleta,0.5,{x:flechaRuleta.posx - flechaRuleta.width/6},{x:flechaRuleta.posx});

            var deltaAngle = 45/2
            //console.log("Angle "+ruletaGroup.angle)
            
            if(ruletaGroup.angle >= 0+deltaAngle && ruletaGroup.angle < 45+deltaAngle){
                if(!fractionPizza[1].press){
                    fractionPizza[1].alpha = 1;
                    fractionPizza[1].press = true;
                     count++;
                }else{
                    fractionPizza[1].tint = 0x000000;
                    count = 0;
                    reset()
                    
                }
                    
            }
            
            else if(ruletaGroup.angle >= 45+deltaAngle && ruletaGroup.angle < 90+deltaAngle){                
                if(!fractionPizza[8].press){
                    fractionPizza[8].alpha = 1;
                    fractionPizza[8].press = true;
                     count++;
                }else{
                    fractionPizza[8].tint = 0x000000;
                    reset()
                }
            }    

            else if(ruletaGroup.angle >= 90+deltaAngle && ruletaGroup.angle < 135+deltaAngle){
                if(!fractionPizza[7].press){
                    fractionPizza[7].alpha = 1;
                    fractionPizza[7].press = true;
                     count++;
                }else{
                    fractionPizza[7].tint = 0x000000;
                    reset() 
                }
            }            

            else if(ruletaGroup.angle >= 135+deltaAngle && ruletaGroup.angle < 180+deltaAngle){
                if(!fractionPizza[6].press){
                    fractionPizza[6].alpha = 1;
                    fractionPizza[6].press = true;
                     count++;
                }else{
                    fractionPizza[6].tint = 0x000000;
                    reset()
                }
            }            
            else if(ruletaGroup.angle >= 180+deltaAngle && ruletaGroup.angle < 225+deltaAngle){
                if(!fractionPizza[5].press){
                    fractionPizza[5].alpha = 1;
                    fractionPizza[5].press = true;
                     count++;
                }else{
                    fractionPizza[5].tint = 0x000000;
                    reset() 
                }
            }            
            else if(ruletaGroup.angle >= 225+deltaAngle && ruletaGroup.angle < 270+deltaAngle){
                if(!fractionPizza[4].press){
                    fractionPizza[4].alpha = 1;
                    fractionPizza[4].press = true;
                     count++;
                }else{
                    fractionPizza[4].tint = 0x000000;
                    reset()
                }
            }            
            else if(ruletaGroup.angle >= 270+deltaAngle && ruletaGroup.angle < 315+deltaAngle){
                if(!fractionPizza[3].press){
                    fractionPizza[3].alpha = 1;
                    fractionPizza[3].press = true;
                     count++;
                }else{
                    fractionPizza[3].tint = 0x000000;
                    reset()
                }
            }            
            else if(ruletaGroup.angle >= 315+deltaAngle || ruletaGroup.angle < 0+deltaAngle){
                if(!fractionPizza[2].press){
                    fractionPizza[2].alpha = 1;
                    fractionPizza[2].press = true;
                     count++;
                }else{
                    fractionPizza[2].tint = 0x000000;
                    reset()
                }
            }
            
            
            

            /*var rouleteAngle = 45

            for(var i = 0 ; i < fractionPizza.lenght; i++){

            }*/
            
            if(count == fractions[0].id){
                sound.play("magic");
				coins++;
				xpText.setText(coins);
				timbre_iddle.inputEnabled = false;
                TweenMax.fromTo(star.scale,1,{x:4,y:4},{x:8,y:8})
				TweenMax.fromTo(star,1,{alpha:1},{alpha:0,onComplete:newroulette});
                count = 0;
                particleCorrect.x = fracciones.x 
                particleCorrect.y = fracciones.y
                particleCorrect.start(true, 1200, null, 6)
                
            }
            
			/*timbre_iddle.inputEnabled = false;
			if(fractions[0].id == count){
				sound.play("magic");
				coins++;
				xpText.setText(coins);
				TweenMax.fromTo(star.scale,3,{x:4,y:4},{x:8,y:8})
				TweenMax.fromTo(star,3,{alpha:1},{alpha:0,onComplete:newroulette});
				for(i=1;i<=numPizzas-1;i++){
					fractionPizza[i].inputEnabled = false;
				}
                
			}else{
				bgm.stop();
				sound.play("wrong");
				sound.play("gameLose");
				for(i=0;i<=numPizzas-1;i++){
					fractionPizza[i].inputEnabled = false;
				}
				TweenMax.fromTo(sceneGroup,1,{alpha:1},{alpha:0,delay:1,onComplete:gameOver})
			}
			
			
			if(coins == 3){
						bgclock.alpha = 1;
						clockText.alpha = 1;
						TweenMax.to(bgclock.scale,0.5,{x:1,ease:Back.easeOut});
						TweenMax.to(clockText.scale,0.5,{x:1,ease:Back.easeOut});
						
			}
			
			if(coins > 3){
				clearInterval(timerCount);
			}*/
            
             
			
		}		
        
        function reset(){
                
                lives--
                createHearts(lives)
                if(lives==0){
                   stopGame()
                   }
                clockText.setText(timer);
			    clearInterval(timerCount);
                count=0;
                particleWrong.x = fracciones.x 
                particleWrong.y = fracciones.y
                particleWrong.start(true, 1200, null, 6)
                timbre_iddle.inputEnabled = false;
                sound.play("wrong");
				sound.play("gameLose");
            
            newroulette()
            }
        function stopGame(){
            timbre_iddle.inputEnabled = false;
            TweenMax.fromTo(sceneGroup,1,{alpha:1},{alpha:1,delay:1,onComplete:gameOver});
					sound.play("wrong");
					sound.play("gameLose");
					bgm.stop();	
            starGame = false;
            particleWrong.x = fracciones.x 
                particleWrong.y = fracciones.y
                particleWrong.start(true, 1200, null, 6)
        }
        
		
        function createParticles(){
                particleCorrect = createPart('star')
                sceneGroup.add(particleCorrect)
        
                particleWrong = createPart('wrong')
                sceneGroup.add(particleWrong)
            }
            
            function createPart(key){
                var particle = game.add.emitter(0, 0, 100);

                particle.makeParticles(key);
                particle.minParticleSpeed.setTo(-200, -50);
                particle.maxParticleSpeed.setTo(200, -100);
                particle.minParticleScale = 0.6;
                particle.maxParticleScale = 1;
                particle.gravity = 150;
                particle.angularDrag = 30;

                return particle
            }
		
		function newroulette(){
                if(giro <= 13){
                   giro = giro + 0.5; 
                }
                
                timbre_iddle.inputEnabled = true;
				shuffle(fractions);
				count = 0;
				for(i=1;i<=numPizzas;i++){
					fractionPizza[i].alpha = 0.2;
					fractionPizza[i].inputEnabled = true;
					fractionPizza[i].press = false;
                    fractionPizza[i].tint = 0xffffff;
				}
				textGlobe.setText(fractions[0].fraction);
				sound.play("combo");
			/*if(coins >= 20){
				timer = 10;
				clearInterval(timerCount);
				timerCount = setInterval(timerFunction, 1000);
			}*/
		}
		
		
	function gameOver(){
		var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,gameIndex)
			sceneloader.show("result");
	}		
		
		
	timerFunction = function(){
		if(timer != 0){
			timer-- 
		}else if(timer == 0){
				lives--
			clearInterval(timerCount);
					TweenMax.fromTo(sceneGroup,1,{alpha:1},{alpha:1,delay:1,onComplete:gameOver});
					sound.play("wrong");
					sound.play("gameLose");
		}
		clockText.setText(timer);
	}		
		
	
		bgclock = sceneGroup.create(0,1,"bgclock");
		bgclock.x = game.width * 0.5;
		bgclock.anchor.setTo(0.5, 0);
		clockText = game.add.text(50, 46, timer, styleClock,sceneGroup);	
		clockText.x = game.width * 0.5;
		clockText.anchor.setTo(0.5, 0);
		bgclock.alpha = 0;
		clockText.alpha = 0;
		
		createCoins(coins);
		createHearts(lives);
		createOverlay(lives);
        createParticles();
        
		
	}


	
	function update() {
        if(starGame){
		if(ruletaGroup.angle <= 360){
          ruletaGroup.angle += giro  
        }else{
           ruletaGroup.angle = 0; 
        }
            
        }
        
        

	}
		

	
	
	return {
		assets: assets,
		name: "luckynumber",
		preload: preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()