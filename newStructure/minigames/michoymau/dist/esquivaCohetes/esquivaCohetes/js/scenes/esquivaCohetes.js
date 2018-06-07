var soundsPath = "../../shared/minigames/sounds/"
var esquivaCohetes = function(){

	assets = {
        atlases: [                
			{
                //name: "atlas.esquivaCuetes",
                //json: "images/esquivaCuetes/atlas.json",
                //image: "images/esquivaCuetes/atlas.png",
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
				file: soundsPath + "fireExplosion.mp3"},
			{	name: "shootBall",
				file: soundsPath + "shootBall.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"}
		],
	}
    
    var gameIndex = 0;
	var background;
	var carril = new Array;
	var buttonsGame = new Array;
	var baseBotones;
	var items = new Array;
	var coinSprites = new Array;	
	var glowArray = new Array;	
	var sceneGroup = null;
	var heartsGroup = null;
	var blockCollisionGroup;
	var dinamita;
	var speedGame = 5;
	var wallLeft;
	var wallRigth;
	var heartsIcon;
	var heartsText;	
	var xpIcon;
	var xpText;
	var lastItem;
	var cursors;
	var leftMove = false;
	var rightMove = false;
	var lives = 3;
	var coins = 0;
	var bgm = null;
    var explotionYogotar;
    var explotionfirework;
	var starGame = false;
	var pressLeft = false;
	var pressRight = false;
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
		game.load.image("item0", "images/esquivaCuetes/item1.png");
		game.load.image("item1", "images/esquivaCuetes/item2.png");
		game.load.image("item2", "images/esquivaCuetes/item3.png");
		game.load.image("item3", "images/esquivaCuetes/item4.png");	
		game.load.image("item4", "images/esquivaCuetes/item5.png");
		game.load.image("item5", "images/esquivaCuetes/item6.png");
		game.load.image("item6", "images/esquivaCuetes/item7.png");
		game.load.image("item7", "images/esquivaCuetes/item8.png");		
		game.load.spine("dinamita", "images/esquivaCuetes/dinamita/skeleton.json");
		game.load.image("heartsIcon", "images/esquivaCuetes/hearts.png");
		game.load.image("xpIcon", "images/esquivaCuetes/xpcoins.png");
		game.load.image("background", "images/esquivaCuetes/background.png");
		game.load.image("carril", "images/esquivaCuetes/carril.png");
		game.load.image("baseBotones", "images/esquivaCuetes/baseBotones.png");
		game.load.image("ButtonLeft_1", "images/esquivaCuetes/ButtonLeft_1.png");
		game.load.image("ButtonRight_1", "images/esquivaCuetes/ButtonRight_1.png");
		game.load.image('gametuto',"images/esquivaCuetes/gametuto.png");
		game.load.image('introscreen',"images/esquivaCuetes/introscreen.png");
		game.load.image('buttonPlay',"images/esquivaCuetes/button.png");		game.load.image('pc',"images/esquivaCuetes/desktop.png");
		game.load.image('howTo',"images/esquivaCuetes/howES.png");
		game.load.image('buttonText',"images/esquivaCuetes/playES.png");
        game.load.image('explotionYogotar',"images/esquivaCuetes/explotionYogotar.png");		game.load.image('explotionfirework',"images/esquivaCuetes/explotionfirework.png");
		game.load.audio('wormwood',  soundsPath + 'songs/wormwood.mp3');
		game.load.spritesheet('coinSprite', 'images/esquivaCuetes/coin_sprite.png', 122, 123, 12);
        game.load.spritesheet('glow', 'images/esquivaCuetes/glow.png', 170, 141, 11);
        game.load.image('smoke',"images/esquivaCuetes/smoke.png");
        game.load.image('star',"images/esquivaCuetes/star.png");
        game.load.image('wrong',"images/esquivaCuetes/wrong.png");
		;
        /*COMIC*/
        game.load.image('comic1',"images/esquivaCuetes/comic/1.png");
        game.load.image('comic2',"images/esquivaCuetes/comic/2.png");
        game.load.image('comic3',"images/esquivaCuetes/comic/3.png");
        game.load.image('comic4',"images/esquivaCuetes/comic/4.png");
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
    
function createTextPart(text,obj){
        
       var pointsText = lookParticle('text')
        
       if(pointsText){
            
           pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.setText(text)
            pointsText.scale.setTo(1,1)

           game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

           deactivateParticle(pointsText,750)
        }
        
   }
    
   function lookParticle(key){
        
       for(var i = 0;i<particlesGroup.length;i++){
            
           var particle = particlesGroup.children[i]
            //console.log(particle.tag + ' tag,' + particle.used)
            if(!particle.used && particle.tag == key){
                
                particle.used = true
                particle.alpha = 1
                
               particlesGroup.remove(particle)
                particlesUsed.add(particle)
                
                console.log(particle)
                
               return particle
                break
            }
        }
        
   }
    
   function deactivateParticle(obj,delay){
        
       game.time.events.add(delay,function(){
            
           obj.used = false
            
           particlesUsed.remove(obj)
            particlesGroup.add(obj)
            
       },this)
    }
    
   function createPart(key,obj,offsetX){
        
       var offX = offsetX || 0
        var particle = lookParticle(key)
        
       if(particle){
            
           particle.x = obj.world.x + offX
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            //game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            //game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            particle.start(true, 1500, null, 6);
            
            game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
                deactivateParticle(particle,0)
            })
            
       }
        
       
   }
    
   function createParticles(tag,number){
                
       for(var i = 0; i < number;i++){
            
           var particle
            if(tag == 'text'){
                
               var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff ", align: "center"}
                
               var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
           }else{
                var particle = game.add.emitter(0, 0, 100);

                particle.makeParticles(tag);
                particle.minParticleSpeed.setTo(-200, -50);
                particle.maxParticleSpeed.setTo(200, -100);
                particle.minParticleScale = 0.6;
                particle.maxParticleScale = 1.5;
                particle.gravity = 150;
                particle.angularDrag = 30;
                
                particlesGroup.add(particle)
                
           }
            
           particle.alpha = 0
            particle.tag = tag
            particle.used = false
            //particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
       
   }
    
    function addParticles(){
        
        particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)
        
        particlesUsed = game.add.group()
        sceneGroup.add(particlesUsed)
        
        createParticles('star',3)
        createParticles('wrong',1)
        createParticles('text',5)
        createParticles('smoke',1)

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
        overlayGroup = game.add.group()
		if(game.device != 'desktop'){
		overlayGroup.scale.setTo(1,1);
		}else{
			overlayGroup.scale.setTo(1.2,1.2);
		}
		
        sceneGroup.add(overlayGroup)
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width, game.world.height);
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("pop");
         game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                overlayGroup.y = -game.world.height
		
		bgm = game.add.audio('wormwood')
            game.sound.setDecodedCallback(bgm, function(){
            }, this);
		
		bgm.loopFull(0.5);
		starGame = true;
		buttons.getButton(bgm,sceneGroup)
				//TweenMax.to(readyButton,1,{y:game.height - readyButton.height,ease:Back.easeOut});		
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5);
		//plane.x = game.world.width * 0.55;
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'gametuto')
		tuto.anchor.setTo(0.5,0.5)
		
        
        var action = 'tap'
        
        if(game.device == 'desktop'){
            action = 'click'
        }
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 225,'howTo')
		howTo.anchor.setTo(0.48,0.5)
		howTo.scale.setTo(0.7,0.7)
        
		var deviceName = 'pc'
		var offsetX = 0
        if(!game.device.desktop){
           deviceName = 'tablet'
			offsetX = 50
		  	var inputLogo = overlayGroup.create(game.world.centerX + offsetX,game.world.centerY + 145,'movil');
        	inputLogo.anchor.setTo(0.5,0.5);	 
        }else{
			var inputLogo = overlayGroup.create(game.world.centerX-20,game.world.centerY + 145,'pc');
        	inputLogo.anchor.setTo(0.25,0.5);	
		}
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height,'buttonPlay')
		button.anchor.setTo(0.4,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.4,0.5)
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
		loadSounds();
		background = game.add.tileSprite(0,0,game.world.width, game.world.height, "background");
		sceneGroup.add(background);
		carril[1] = game.add.tileSprite(game.world.centerX - 75,0,146, 851, "carril");
		carril[0] = game.add.tileSprite(carril[1].x - 146,0,146, 851, "carril");
		carril[2] = game.add.tileSprite(carril[1].x + 146,0,146, 851, "carril");

        
		sceneGroup.add(carril[0]);
		sceneGroup.add(carril[1]);
		sceneGroup.add(carril[2]);
			for(var c = 0;c<=7;c++){
				coinSprites[c] = game.add.sprite(0, -500, 'coinSprite');
				var glowObject = coinSprites[c].animations.add('coinPlay');
				coinSprites[c].animations.play('coinPlay', 12, true);
				coinSprites[c].anchor.setTo(0,0);
                glowArray[c] = game.add.sprite(0, -500, 'glow');
				var glowObject = glowArray[c].animations.add('glowObject');
				glowArray[c].animations.play('glowObject', 11, true);
				glowArray[c].anchor.setTo(0.2,0);
				items[c] = game.add.sprite(0, 0, "item" + c);
				items[c].id = c;
                items[c].contact = false;
				items[c].x = carril[getRandomArbitrary(0,3)].x + items[c].width/8;
                
				if(c == 0){
					items[c].y = -500;
				}else{
					items[c].y = items[c-1].y - 180;
				}
				items[c].impact = false;
				items[c].anchor.setTo(0);	
				if(c % 2 == 0) {
    				items[c].numero = "par";
                    items[c].visible = false;
                    glowArray[c].visible = false;
				 }else{
					items[c].numero = "impar";
					 coinSprites[c].visible = false;   
				 }
				sceneGroup.add(glowArray[c]);
				sceneGroup.add(coinSprites[c]);
				sceneGroup.add(items[c]);			
			}
		dinamita = game.add.spine(game.world.centerX,game.world.centerY + (game.world.centerY/2) ,"dinamita");
		dinamita.setAnimationByName(0, "RUN", true);
		dinamita.setSkinByName("normal");
		dinamita.x = carril[1].x + dinamita.width/1.3;
		sceneGroup.add(dinamita);
		
		lastItem = items[2].y; 
		cursors = game.input.keyboard.createCursorKeys();
		baseBotones = game.add.sprite(0,game.world.centerY + 250,"baseBotones");
		baseBotones.width = game.width; 
        baseBotones.height = game.height/4; 
		sceneGroup.add(baseBotones);
     	var groupButton1 = game.add.group()
        groupButton1.x = game.world.centerX - carril[1].width;
        groupButton1.y = game.world.height -125;
        groupButton1.isPressed = false;
        var button2 = groupButton1.create(0,0, 'ButtonLeft_1')
        button2.anchor.setTo(0.5,0.5);
        button2.inputEnabled = true
        button2.tag = 'left'
        button2.events.onInputDown.add(inputButton1)	
     	var groupButton2 = game.add.group()
        groupButton2.x = game.world.centerX + 10;
        groupButton2.y = game.world.height -125
        groupButton2.isPressed = false   
        var button2 = groupButton2.create(0,0,'ButtonRight_1')
        button2.anchor.setTo(-0.5,0.5);
        button2.inputEnabled = true
        button2.tag = 'right'
        button2.events.onInputDown.add(inputButton2);
        explotionYogotar = sceneGroup.create(0,0,"explotionYogotar");
        explotionYogotar.alpha = 0;
        explotionfirework = sceneGroup.create(0,0,"explotionfirework");
        explotionfirework.alpha = 0;
		sceneGroup.add(groupButton1);
		sceneGroup.add(groupButton2);
		createHearts();
		createCoins();
        //addParticles();
        if(!reviewComic){
            createComic(4);
        }else{
          createOverlay();  
        }
        
	}
	function inputButton1(){
		leftMove = true;
		if(dinamita.x > carril[0].x + dinamita.width/1.3){
		dinamita.x = dinamita.x - carril[0].width;
		}	
	}
	function inputButton2(){
		rightMove = true;	
		if(dinamita.x < carril[2].x + dinamita.width/2){
		dinamita.x = dinamita.x + carril[0].width;
		}
	}	
	function newPosition(object){
		object.y = lastItem;
		object.x = carril[getRandomArbitrary(0,3)].x + object.width/8;
		object.impact = false;
        TweenMax.to(coinSprites[object.id],0,{alpha:1,delay:0.1});
        glowArray[object.id].alpha = 1;
        object.contact = false;
	}
	function SumeCoins(){
	
			dinamita.setAnimationByName(0, "WIN", true);
			dinamita.setSkinByName("win");		
				
	}
	function gameOver(){
		var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,gameIndex)
			sceneloader.show("result");
	}
	function moveObject(object){
		object.y += speedGame;
					coinSprites[object.id].x = object.x;
					coinSprites[object.id].y = object.y;
					glowArray[object.id].x = object.x;
					glowArray[object.id].y = object.y;
		if (parseFloat(object.y) >= 500 && parseFloat(object.y) <= 650 ) {
			if (parseFloat(object.x) >= dinamita.x - 100 && parseFloat(object.x) <= dinamita.x + object.width/2){
				speedGame = speedGame + 0.010;
				if(!object.impact){
					if(object.numero == "par"){	
						TweenMax.to(object.scale,0.3,{x:1.5,y:1.5});
						TweenMax.to(object,0.2,{alpha:0,onComplete:SumeCoins});
						dinamita.setAnimationByName(0, "WIN", true);
						dinamita.setSkinByName("WIN");
						coins++;
						xpText.setText(coins);	
						sound.play("magic");	
						TweenMax.to(coinSprites[object.id],0.2,{alpha:0});
						TweenMax.to(glowArray[object.id],0.2,{alpha:0});
					}
					if(object.numero == "impar"){
						    TweenMax.to(object,0.2,{tint:0xff0000, yoyo:true,repeat:5});
							lives--;
							heartsText.setText("x " + lives);
						    TweenMax.to(dinamita,1,{tint:0xff0707,yoyo:true,repeat:3});
                            object.contact = true;
                            TweenMax.fromTo(explotionYogotar,1,{alpha:1},{alpha:0});
                            explotionYogotar.x = object.x;
                            explotionYogotar.y = object.y;
							if(lives != 0){
								sound.play("wrong");
								sound.play("explode");	
							}else{
								dinamita.setAnimationByName(0, "LOSE", true);
								dinamita.setSkinByName("LOSE");	
								bgm.stop();
								sound.play("gameLose");
								TweenMax.to(this,1,{alpha:0,onComplete:gameOver});		
							}
						}
					object.impact = true;
					}
				}
		}
		if(object.y > game.height - baseBotones.y/2.2){
            if(object.numero == "impar"){
                if(!object.contact){
                    explotionfirework.x = object.x;
                    explotionfirework.y = object.y;
                    TweenMax.fromTo(explotionfirework,1,{alpha:1},{alpha:0});
                }
            }
				newPosition(object);
				TweenMax.to(object.scale,0,{x:1,y:1});
                object.alpha = 1;
		}
	}	
	
	function update() {
		if(starGame){	
			if(lives != 0){
					carril[0].tilePosition.y += speedGame;
					carril[1].tilePosition.y += speedGame;
					carril[2].tilePosition.y += speedGame;	
					moveObject(items[0])
					moveObject(items[1])
					moveObject(items[2]);
					moveObject(items[3]);
					moveObject(items[4])
					moveObject(items[5])
					moveObject(items[6]);
					moveObject(items[7]);
				if (cursors.left.isUp){
				pressLeft = false;
				}
				if (cursors.right.isUp){
				pressRight = false;
				}
				if (cursors.left.isDown){
					if(!pressLeft){
						if(dinamita.x > carril[0].x + dinamita.width/1.3){
							dinamita.x = dinamita.x - carril[0].width;
						}
						pressLeft = true;
					}
				}else if (cursors.right.isDown){
					if(!pressRight){
						if(dinamita.x < carril[2].x + dinamita.width/2){
							dinamita.x = dinamita.x + carril[2].width;
							pressRight = true;
							}
						}
				}
			}
		}
	}
	return {
		assets: assets,
		name: "esquivaCohetes",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()