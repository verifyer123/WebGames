var soundsPath = "../../shared/minigames/sounds/"

var circus = function(){
    
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
    

	var assets = {
        atlases: [
            {   
                name: "atlas.circus",
                json: "images/circus/atlas.json",
                image: "images/circus/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/circus/timeAtlas.json",
                image: "images/circus/timeAtlas.png",
            },

        ],
        images: [
			{   name:"background",
				file: "images/circus/fondo.png"},
            {   name:"background2",
                file: "images/circus/fondoG.png"},
            {   name:"tutorial_image",
				file: "images/circus/tutorial_image.png"},
		],
		jsons: [
			{
				name: 'pickedEnergy', 
				file: 'particles/battle/pickedEnergy/specialBar1.json'
			},
			{
				name: 'fireFloor', 
				file: 'particles/battle/fireFloor/fireFloor1.json'
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
			{	name: "flesh",
				file: soundsPath + "flesh.mp3"},
			{	name: "punch",
				file: soundsPath + "punch1.mp3"},
            {	name: "spaceSong",
				file: soundsPath + "songs/circus_gentlejammers.mp3"},
            {   name: "cheers",
                file: "sounds/cheers2seg.mp3"},
            {   name: "cheersOver",
                file: "sounds/lose2seg.mp3"}
		],
        spritesheets: [
            {   name: "coin",
                file: "images/circus/coin.png",
                width: 122,
                height: 123,
                frames: 12
            },
            {   name: "hand",
               file: "images/circus/hand.png",
               width: 115,
               height: 111,
               frames: 23
           }
        ],
        spines:[
			{
				name:"yogotar",
				file:"images/spines/skeleton.json"
			}
		]
    }
        
    var gameIndex = 38;    
    var lives = null;
	var sceneGroup = null;
    var tutoGroup;
    var heartsGroup = null;
    var pointsBar;
    var coin;
    var particleCorrect;      
    var particleWrong;
    var hand;

	var background,backgroundPeople,floor;
	var base, buttonsGroup, yogotar;
    var gameActive = true;
	var shoot;
    var spaceSong;
	var timerGroup;
	var numLimit, timeToUse;
	var clickLatch = false;
    var speed;
    var number2;
	var numberOptions = [3,4,6];
    var levelZero;
    var glitGroup;
    var pivot;
    var glitter = ['flash_1', 'flash_2', 'flash_3'];
	
	function loadSounds(){
		sound.decode(assets.sounds);
	}

	function initialize(){
        game.stage.backgroundColor = "#ffffff";
        lives = 3;
		numLimit = 5;
		timeToUse = 5000;
        speed = 5;
        number2 = 0;
        levelZero = true;
        pivot = 0;
        
		loadSounds();
	}

    function preload(){
        game.stage.disableVisibilityChange = false;
    }

    function stopGame(win){
        
        loseGame();

        gameActive = false;
        spaceSong.stop();

        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 3000);
        tweenScene.onComplete.add(function(){

            var resultScreen = sceneloader.getScene("result");
            resultScreen.setScore(true, pointsBar.number, gameIndex);
            sceneloader.show("result");
            sound.play("gameLose");
        })
    }

    function loseGame(){
        yogotar.setAnimationByName(0,"lose",false);
        yogotar.addAnimationByName(0,"losestill",true);
        
        var obj = sceneGroup.create(yogotar.x, yogotar.y- 50,'atlas.circus','star');
        obj.anchor.setTo(0.5,0.5);
        obj.alpha = 0;
        
        game.time.events.add(500,function(){
            sound.play("flesh");
            
        })
        
        game.time.events.add(750,function(){
            sound.play("punch");
        })
    }

    function createTutorial(){

        tutoGroup = game.add.group();
        sceneGroup.add(tutoGroup);

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay);

    }

    function onClickPlay(){
        tutoGroup.y = -game.world.height;
        showButtons(true);
    }

    function update(game){
        background.tilePosition.x -= speed * 0.05;
        backgroundPeople.tilePosition.x -= speed * 0.2;
        floor.tilePosition.x -= speed;
        for(var iPhoto=0; iPhoto<glitGroup.length; iPhoto++){
            if(glitGroup.children[iPhoto].alpha > 0){
                glitGroup.children[iPhoto].x -= speed * 0.2;
            }
        }

    }

    function createPointsBar(){
        
        pointsBar = game.add.group();
        pointsBar.x = game.world.width;
        pointsBar.y = 0;
        sceneGroup.add(pointsBar);
        
        var pointsImg = pointsBar.create(-10,10,'atlas.circus','xpcoins');
        pointsImg.anchor.setTo(1,0);
    
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
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
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true);
        });
        
        addNumberPart(pointsBar.text,'+' + number,true);   
        
        if(pointsBar.number % 3 == 0){
            if(numLimit < 9){
                numLimit++;
                timeToUse-=100;
            }
        }
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
               })
           })
        })
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

        var heartImg = group.create(0,0,'atlas.circus','life_box');

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
        });
        
        if(lives == 0){
            stopGame(false);
        }
        
        addNumberPart(heartsGroup.text,'-1',true);
        
    }

    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.circus',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle;
    }

    function createBackground(){
        
        background = game.add.tileSprite(0,0,game.world.width, 236,'background');
        sceneGroup.add(background);

        backgroundPeople = game.add.tileSprite(0,background.height,game.world.width, 236,'background2');
        sceneGroup.add(backgroundPeople);
        
        floor = game.add.tileSprite(0,backgroundPeople.y + backgroundPeople.height,game.world.width,497,'atlas.circus','fondo2');
        sceneGroup.add(floor);
    }

    function createBase(){
        
        base = game.add.group();
        base.x = game.world.centerX;
        base.y = game.world.height - 25;
        sceneGroup.add(base);
        
        var baseImg = base.create(0,0,'atlas.circus','base');
        baseImg.anchor.setTo(0.5,1);
        
        var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
        var pointsText = new Phaser.Text(sceneGroup.game, 0, -baseImg.height * 0.82, "3 X 5", fontStyle);
        pointsText.anchor.setTo(0.5,0.5);
        pointsText.alpha = 0;
        base.add(pointsText);
        
        base.text = pointsText;
        
        yogotar = game.add.spine(game.world.centerX,game.world.height - 350,"yogotar");
        yogotar.setAnimationByName(0,"idle",true);
        yogotar.setSkinByName("normal");
        sceneGroup.add(yogotar);

        hand = game.add.sprite(0, 0, "hand");
        hand.animations.add('hand');
        hand.animations.play('hand', 24, true);
        hand.alpha = 0;
    }

    function createButtons(){
        
        buttonsGroup = game.add.group();
        sceneGroup.add(buttonsGroup);
        
        var pivotX = base.x - 150;
        var pivotY = base.y - 100;
        for(var i = 0;i < 3; i++){
            
            var button = game.add.group();
            button.alpha = 0;
            button.pressed = false;
            button.x = pivotX;
            button.y = pivotY;
            buttonsGroup.add(button);
            
            var buttonImage = button.create(0,0,'atlas.circus','btn');
            buttonImage.anchor.setTo(0.5,0.5);
            //buttonImage.inputEnabled = true;
            buttonImage.tint = 0x909090;
            buttonImage.events.onInputDown.add(inputButton);
            
            var fontStyle = {font: "65px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"};
            var pointsText = new Phaser.Text(sceneGroup.game, 0,0, "0", fontStyle);
            pointsText.anchor.setTo(0.5,0.5);
            button.add(pointsText);
            
            button.text = pointsText;
            
            pivotX+= button.width * 1.12;
        }
    }

    function showButtons(appear){
        
        var delay = 0;
        for(var i = 0; i < buttonsGroup.length;i++){
            
            var button = buttonsGroup.children[i];
            if(appear){
                popObject(button,delay,appear);
            }else{
                popObject(button,delay,appear);
            }
            
            delay+= 100;
            
        }
        
        if(appear){
            
            setOperation();
            
            game.time.events.add(delay,function(){
                gameActive = true;
                popObject(base.text,200,true);
                if(!levelZero){
                    game.time.events.add(500, startTimer, this, timeToUse);
                }
            })
        }
    }

    function createTimer(){
        
        timerGroup = game.add.group();
        //timerGroup.alpha = 0;
        sceneGroup.add(timerGroup);
        
        var clock = timerGroup.create(game.world.centerX, 75, "atlas.time", "clock");
        clock.anchor.setTo(0.5);
        
        var timeBar = timerGroup.create(clock.centerX - 175, clock.centerY + 19, "atlas.time", "bar");
        timeBar.anchor.setTo(0, 0.5);
        timeBar.scale.setTo(11.5, 0.65);
        timerGroup.timeBar = timeBar;
   }
    
    function stopTimer(){
        
        timerGroup.tweenTiempo.stop();
        game.add.tween(timerGroup.timeBar.scale).to({x:11.5}, 100, Phaser.Easing.Linear.Out, true, 100);
   }
    
    function startTimer(time){
        
        timerGroup.tweenTiempo = game.add.tween(timerGroup.timeBar.scale).to({x:0}, time, Phaser.Easing.Linear.Out, true, 100);
        timerGroup.tweenTiempo.onComplete.add(function(){
            gameActive = false;
            stopTimer();
            for(var i = 0; i < buttonsGroup.length; i++){
                var btn = buttonsGroup.children[i];
                if(btn.number !== result){
                    game.add.tween(btn.scale).to({x:0,y:0},250,"Linear",true);
                }
            }
            speed = 0;
            sound.play("cheersOver");
            particleWrong.x = yogotar.x;
            particleWrong.y = yogotar.y - yogotar.height/2;
            particleWrong.start(true, 1000, null, 5);
            missPoint();
            if(lives > 0){
                yogotar.setAnimationByName(0,"hit",false).onComplete = function(){
                    speed = 5;
                }
                yogotar.addAnimationByName(0,"idle",true);
                game.time.events.add(1800, restartScene);
            }
        });
        for(var b=0; b<buttonsGroup.length; b++){
            buttonsGroup.children[b].children[0].inputEnabled = true;
        }
    }

    function popObject(obj,delay,appear){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut");
			if(appear){

				obj.alpha = 1;
            	game.add.tween(obj.scale).from({x:0, y:0},250,Phaser.Easing.linear,true);
			}else{
				game.add.tween(obj.scale).to({x:0,y:0},250,"Linear",true).onComplete.add(function(){
					obj.scale.setTo(1,1);
					obj.alpha = 0;
				})
			}
        },this)
    }
	
	function setOperation(){
		
		var number1 = numberOptions[game.rnd.integerInRange(0, numberOptions.length - 1)];
		number2 = getRand(number2);
		
		base.text.setText(number1 + ' X ' + number2);
		result = number1 * number2;
		
		var index =  game.rnd.integerInRange(0,2);
        buttonsGroup.children[index].number = result;
        if(levelZero){
            hand.x = buttonsGroup.children[index].x;
            hand.y = buttonsGroup.children[index].y;
            buttonsGroup.children[index].children[0].inputEnabled = true;
            buttonsGroup.children[index].children[0].tint = 0xffffff;
            game.add.tween(hand).to( { alpha: 1 }, 300, Phaser.Easing.Bounce.In, true, 0, 0);
        }
        
		for(var i = 0; i < buttonsGroup.length;i++){
			
			var button = buttonsGroup.children[i];
			if(i !== index){
                do{
                    var number1 = game.rnd.integerInRange(2, numLimit);
                    var number3 = game.rnd.integerInRange(2, numLimit);
                    var opt = number1 * number3;
                }while(checkExist(opt))
                
				buttonsGroup.children[i].number = opt;
			}
			
			button.text.setText(button.number);
		}
		
		popObject(button.text,0,true);
	}
    
    function checkExist(opt){
        
        for(var i = 0; i < buttonsGroup.length; i++){
            
            if(buttonsGroup.children[i].number === opt){
                return true;
            }
        }
        return false;
    }
    
    function getRand(opt){
        var x = game.rnd.integerInRange(2, numLimit);
        if(x === opt)
            return getRand(opt);
        else
            return x;     
    }

	function inputButton(obj){
		
		if(!gameActive){
			return;
		}
		
        if(!levelZero){
            stopTimer();
        }
		var parent = obj.parent;
		
		sound.play("pop");
		
		game.add.tween(parent.scale).to({x:0.6,y:0.6},100,"Linear",true,0,0,true);
        
        for(var i = 0; i < buttonsGroup.length; i++){
            var btn = buttonsGroup.children[i];
            buttonsGroup.children[i].children[0].inputEnabled = false;
            if(btn.number !== result){
                game.add.tween(btn.scale).to({x:0,y:0},250,"Linear",true);
            }
        }
		
		gameActive = false;
		
		if(parent.number == result){
            if(!levelZero){
		        addCoin(yogotar);
            }else{
                game.add.tween(hand).to( { alpha: 0 }, 300, Phaser.Easing.Bounce.In, true, 0, 0);
            }
            sound.play("cheers");
            particleCorrect.x = yogotar.x;
            particleCorrect.y = yogotar.y - yogotar.height/2;
            particleCorrect.start(true, 1000, null, 5);
			speed = 0;
			yogotar.setAnimationByName(0,"win",false).onComplete = function(){
                speed = 5;
            }
			yogotar.addAnimationByName(0,"idle",true);
			game.time.events.add(1800, restartScene);
		}else{
            sound.play("cheersOver");
			particleWrong.x = yogotar.x;
            particleWrong.y = yogotar.y - yogotar.height/2;
            particleWrong.start(true, 1000, null, 5);
            speed = 0;
            if(!levelZero){
                missPoint();
            }
            if(lives > 0){
                yogotar.setAnimationByName(0,"hit",false).onComplete = function(){
                    speed = 5;
                }
                yogotar.addAnimationByName(0,"idle",true);
                game.time.events.add(1800, restartScene);
            }
		}
		
	}
	
	function restartScene(){

        if(levelZero){
            levelZero = false;
            for(var i = 0; i < buttonsGroup.length; i++){
                buttonsGroup.children[i].children[0].tint = 0xffffff;
            }
        }
		
		showButtons(false);
		game.add.tween(base.text).to({alpha:0},300,"Linear",true,200);
		
		game.time.events.add(1000,function(){
			showButtons(true);
		})
		
	}

    function createParticles(){
        particleCorrect = createPart("star");
        sceneGroup.add(particleCorrect);

        particleWrong = createPart("smoke");
        sceneGroup.add(particleWrong);
    }

    function createFlashes(){
           
        glitGroup = game.add.group();
        glitGroup.x = backgroundPeople.x;
        glitGroup.y = backgroundPeople.y;
        glitGroup.width = backgroundPeople.width;
        glitGroup.height = backgroundPeople.height;
        sceneGroup.add(glitGroup);
        
        for(var l = 0; l < 10; l ++){
            var glit = game.add.sprite(0, 0, "atlas.circus", glitter[game.rnd.integerInRange(0, 2)]);
            glit.alpha = 0;
            glitGroup.add(glit);
        }
        
        takePhotosFlashes();
    }
    
    function takePhotosFlashes(){
        glitGroup.children[pivot].alpha = 1;
        glitGroup.children[pivot].x = game.rnd.integerInRange(0, backgroundPeople.width);
        glitGroup.children[pivot].y = game.rnd.integerInRange(15, backgroundPeople.height - 80);
    
        game.time.events.add(150,function(){
            game.add.tween(glitGroup.children[pivot]).to({ alpha: 0 }, 1000, Phaser.Easing.linear, true);
            
            if(pivot < 9){
                pivot++;
            }
            else{
                pivot = 0;
            }
            
            game.time.events.add(500,function(){
                takePhotosFlashes();
            },this);

        }, this);
    }
	
	return {
		assets: assets,
		name: "circus",
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
                game.sound.mute = true;
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false;
            }, this);

            spaceSong = game.add.audio('spaceSong');
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.6);
            }, this);
			
			createBackground();
            initialize();

            createFlashes();
			createBase();
			createButtons();
			createTimer();
            
            createHearts();           			
            createPointsBar();
            createCoin();
            createParticles();
            createTutorial();
			
			buttons.getButton(spaceSong,sceneGroup);
            
		},
	}
}()