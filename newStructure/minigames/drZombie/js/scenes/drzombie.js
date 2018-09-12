
var soundsPath = "../../shared/minigames/sounds/";

var drzombie = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"cerebro":"Brain",
			"corazon":"Heart",
			"estomago":"Stomach",
			"higado":"liver",
			"intestino_del":"Small \nIntestine",
			"intestino_grueso":"Large \nIntestine",
			"pulmon":"Lungs",
			"rinones":"Kidneys"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"cerebro":"Cerebro",
			"corazon":"Corazón",
			"estomago":"Estómago",
			"higado":"Hígado",
			"intestino_del":"Intestino \nDelgado",
			"intestino_grueso":"Intestino \nGrueso",
			"pulmon":"Pulmones",
			"rinones":"Riñones"
		}
	}
    

	var assets = {
        atlases: [
            {   
                name: "atlas.zombie",
                json: "images/zombie/atlas.json",
                image: "images/zombie/atlas.png",
            }
        ],
        images: [
        	{   name:"tutorial_image",
                file: "images/zombie/tutorial_image.png"}
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
				file: soundsPath + "songs/space_bridge.mp3"}
		],
		spritesheets:[
            {   name: "coin",
               file: "images/zombie/coin.png",
               width: 122,
               height: 123,
               frames: 12
            },
            {   name: "hand",
               file: "images/zombie/hand.png",
               width: 115,
               height: 111,
               frames: 23
           },
           {   name: "zombie",
               file: "images/zombie/spriteSheets/zombie.png",
               width: 589,
               height: 554,
               frames: 13
           }
        ],
		spines:[
            {
                name:"zombie",
                file:"images/spines/zombies.json"
            }
        ]
    }
   
    var lives = null;
	var sceneGroup = null;
	var gameActive = false;
	var gameIndex = 94;
	var particleCorrect;      
    var particleWrong;
    var hand;
    var tutoGroup;
    var heartsGroup = null;
    var pointsBar;
    var coin;
 	var shoot;
    var spaceSong;
	var background, floor;
	var zombieSpine;
	var organsGroup, organsContainers;
	var numberOrgans,numberOk;
	var oContainer, xContainer;
	var clock;
	var nameOrgan;
	var timeToUse;
	var objToUse;
	var organsPosition = [
		{name: "cerebro" ,x:-5.274336283185846, y:196.86363636363637},
		{name: "pulmon" ,x:-2.774336283185846, y:-10},
		{name: "corazon" ,x:-41.98672566371681, y:12.834224598930462},
		{name: "estomago" ,x:-3.491150442477874, y:-30.802139037433165},
		{name: "intestino_del" ,x:-4.774336283185846, y:-93.18983957219257},
		{name: "intestino_grueso" ,x:-5.274336283185846, y:-97.04010695187162},
		{name: "higado" ,x:17.039823008849567, y:-47.48663101604279},
		{name: "rinones" ,x:-4.774336283185846, y:-35.435828877005406}
	];
	var levelZero;
	var OFFSETPIVOTX;
	var OFFSETPIVOTY;
	var stringToUse = ['',1,2];
	var zombieid;
	var indexTrash;
	var countTrash = 1;
	var arrayTrash = [];
	var arrayIndex = [];
	var trashLevelZeroX;
	var trashLevelZeroY;
	var tagsToUse;
	var lastPositionX;
	var lastPositionY;
	var counterTrashCleaning;

	function loadSounds(){
		sound.decode(assets.sounds);
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff";
        lives = 3;
		numberOrgans = 1;
		timeToUse = 20000;
		objToUse = null;
		levelZero = true;
		OFFSETPIVOTX = game.world.centerX - 200;
		OFFSETPIVOTY = game.world.height - 175;
		counterTrashCleaning = 0;
        
        loadSounds();
        
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
		//gameActive = true;
		
		setOrgans();
    }

    function update(){
		if(objToUse){
			nameOrgan.x = objToUse.x;
			nameOrgan.y = objToUse.y - 100;
		}
	}

	function createPointsBar(){
        
        pointsBar = game.add.group();
        pointsBar.x = game.world.width;
        pointsBar.y = 0;
        sceneGroup.add(pointsBar);
        
        var pointsImg = pointsBar.create(-10,10,'atlas.zombie','xpcoins');
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

        var heartImg = group.create(0,0,'atlas.zombie','life_box');

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
            stopGame(false);
        }
        
        addNumberPart(heartsGroup.text,'-1');   
    }

    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.zombie',key);
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

    function popObject(obj,delay,alphaValue){
        
		var alpha = alphaValue || 1;
        game.time.events.add(delay,function(){
            
            sound.play("cut");
            obj.alpha = alpha;
            game.add.tween(obj.scale).from({x:0, y:0},250,Phaser.Easing.linear,true);
        },this);
    }
    
	function zombieLose(){
		
		game.add.tween(xContainer).to({alpha:0,y:xContainer.y - 200},500,"Linear",true);
		zombieSpine.setAnimationByName(0,"LOSE",false);
		
		game.add.tween(zombieSpine.anim).to({alpha:0},500,"Linear",true);
		game.add.tween(oContainer).to({alpha:0},500,"Linear",true);
		game.add.tween(clock).to({alpha:0},500,"Linear",true);
		for(t=0; t<arrayTrash.length; t++){
			game.add.tween(arrayTrash[t]).to( { alpha: 0 }, 500, Phaser.Easing.Linear.In, true, 0, 0).onComplete.add(function(){
				sceneGroup.remove(arrayTrash[t]);
			});
		// 	deleteTrash(arrayTrash[t]);
		}
		desappearOrgans();
		
		sound.play("steam");
		sound.play("zombieUp");

		game.time.events.add(3000,function(){
			if(lives>0){
				game.add.tween(zombieSpine).to({alpha:0},800,"Linear",true).onComplete.add(function(){
					setOrgans();
				});
			}
		});
		
	}

	function desappearOrgans(){
		for(var i = 0; i < organsGroup.length;i++){
			var organ = organsGroup.children[i];
			var organ2 = organsContainers.children[i];

			game.add.tween(organ).to({alpha:0},500,"Linear",true);	//Desaparece los organos del drag
			game.add.tween(organ2).to({alpha:0},500,"Linear",true); //Desaparece los slots de organos
			organ.x = -100;
			organ.y = -200;
		}
		gameActive = false;
		activateOrgans(false);
	}

	function setOrgans(){
		
		zombieSpine.alpha = 1;
		
		zombieid = getRand();
		
		zombieSpine.setSkinByName("normal" + stringToUse[zombieid]);
		sound.play("zombieUp");
		game.add.tween(zombieSpine).from({x: - 200},3000,"Linear",true).onComplete.add(function(){
			
			zombieSpine.setAnimationByName(0,"IDLE",true);
			xContainer.y = 0;
			sound.play("steam");
			
			game.add.tween(xContainer).to({y:game.world.centerY - 10, alpha:1},750,"Linear",true).onComplete.add(function(){
				
				game.add.tween(zombieSpine.anim).to({alpha:1},100,"Linear",true,0,5).onComplete.add(chooseOrgans)
				sound.play("gear");
			})
		})
		zombieSpine.setAnimationByName(0,"WALK",true);
	}

	function getRand(){
        var x = game.rnd.integerInRange(0, 2);
        if(x === zombieid)
            return getRand();
        else
            return x;
    }
	
	function chooseOrgans(){
		counterTrashCleaning = 0;
		numberOk = 0;
		tagsToUse = [];
		Phaser.ArrayUtils.shuffle(organsPosition);
		arrayTrash.length = 0;
		arrayIndex.length = 0;
		
		for(var i = 0; i < numberOrgans;i++){
			
			var tag = organsPosition[i].name;
			tagsToUse[tagsToUse.length] = tag;
			arrayIndex[i] = tag;
		}

		if(!levelZero){
		 	countTrash = game.rnd.integerInRange(0, tagsToUse.length);
		 	arrayIndex.length = countTrash;
		}

		var delay = 250;
		for(var i = 0; i < organsContainers.length;i++){
			
			var organ = organsContainers.children[i];
			for(var  u = 0; u < tagsToUse.length;u++){
				
				var tag = tagsToUse[u];
				if(tag == organ.tag){
					popObject(organ,delay);
					organ.active = true;
					delay+= 250;
					if(levelZero){
						createTrash(organ);
						trashLevelZeroX = organ.x;
						trashLevelZeroY = organ.y;
					}
				}
				var tagTrash = arrayIndex[u];
				if(!levelZero && tagTrash==organ.tag){
					createTrash(organ);
				}
			}
		}
		
		popObject(oContainer,delay,0.6);
		delay+= 200;
		
		var pivotX = OFFSETPIVOTX;//game.world.centerX - 200;
		var pivotY = OFFSETPIVOTY//game.world.height - 165;
		var initX = pivotX;
		
		var orgNumber = 0;
		for(var i = 0; i < organsGroup.length;i++){
			
			var organ = organsGroup.children[i];
			for(var u = 0; u < tagsToUse.length;u++){
				var tag = tagsToUse[u];
				if(tag == organ.tag){
					
					organ.alpha = 0;
					organ.x = pivotX;
					organ.y = pivotY;
					organ.origX = organ.x;
					organ.origY = organ.y;
					organ.inputEnabled = true;
					
					popObject(organ,delay);
					delay+= 250;
					
					pivotX+= 125;
					
					orgNumber++;
					if(orgNumber == 4){
						pivotX = initX;
						pivotY+= 100;
					}
				}
			}
		}

		if(!levelZero){
			game.time.events.add(delay,function(){
				gameActive = true;

				popObject(clock,0);
				game.time.events.add(250,function(){
					activateInputTrash();
					if(counterTrashCleaning == 0){
						activateOrgans(true);
					}
				},this);
				
				var bar = clock.bar;
				bar.scale.x = bar.origScale;
				
				clock.tween = game.add.tween(bar.scale).to({x:0},timeToUse,"Linear",true);
				clock.tween.onComplete.add(function(){
					particleWrong.x = zombieSpine.x;
	                particleWrong.y = zombieSpine.y/2;
	                particleWrong.start(true, 1000, null, 5);
	                zombieLose();
	                missPoint();
					
				});
			});
		}else{
			hand.x = trashLevelZeroX; //OFFSETPIVOTX;
			hand.y = trashLevelZeroY; //OFFSETPIVOTY;
			var indexAns = searchPositionOrgan(tagsToUse);
			game.time.events.add(800,function(){
				game.world.bringToTop(hand);
				game.add.tween(hand).to( { alpha: 1 }, 300, Phaser.Easing.Linear.In, true, 0, 0).onComplete.add(function(){
					game.add.tween(hand).to( { x: organsContainers.children[indexAns].x + 100, y: organsContainers.children[indexAns].y - 50}, 800, Phaser.Easing.Linear.InOut, true, 0, -1); 
				});
			});
			game.time.events.add(delay,function(){
				gameActive = true;
				activateInputTrash();
				activateOrgans(false);
			},this);
		}
	}

	function activateInputTrash(){
		for(t= 0; t<arrayTrash.length; t++){
			arrayTrash[t].inputEnabled = true;
			arrayTrash[t].input.enableDrag(true);
		}
	}

	function createTrash(organ){
		counterTrashCleaning++;
		indexTrash = game.rnd.integerInRange(1,6);
		var trashPrefab = game.add.sprite(organ.x, organ.y, 'atlas.zombie', 'toy_0'+indexTrash);
		trashPrefab.firstPositionX = organ.x;
		trashPrefab.firstPositionY = organ.y;
		trashPrefab.anchor.setTo(0.5,0.5);
		trashPrefab.scale.setTo(0.6,0.6);
		trashPrefab.events.onDragStart.add(bringToTopTrash, this);
		trashPrefab.events.onDragStop.add(deleteTrash, this);
		trashPrefab.release = organ;
		sceneGroup.add(trashPrefab);
		organ.active = false;
		arrayTrash.push(trashPrefab);
	}

	function bringToTopTrash(obj){
		sceneGroup.bringToTop(obj);
	}

	function deleteTrash(obj){ 
	lastPositionX = game.input.x;
	lastPositionY = game.input.y;
	var distX = Math.abs(lastPositionX - obj.firstPositionX);
	var distY = Math.abs(lastPositionY - obj.firstPositionY);
	if(distX > 50 || distY > 50){
		game.add.tween(obj).to( { alpha: 0 }, 500, Phaser.Easing.Linear.In, true, 0, 0).onComplete.add(function(){
			obj.release.active = true;
			obj.destroy();
			counterTrashCleaning--;
			if(counterTrashCleaning == 0){
				activateOrgans(true);
			}
		});
		if(levelZero){
			hand.x = OFFSETPIVOTX;
			hand.y = OFFSETPIVOTY;
			var indexAns = searchPositionOrgan(tagsToUse);
			game.add.tween(hand).to( { x: organsContainers.children[indexAns].x, y: organsContainers.children[indexAns].y}, 2000, Phaser.Easing.Linear.InOut, true, 0, -1);
		}
	}else{
		game.add.tween(obj).to( { x: obj.firstPositionX, y: obj.firstPositionY}, 300, Phaser.Easing.Linear.InOut, true, 0);
	}
	}

	function searchPositionOrgan(tagsToUse){
		for(var i = 0; i < organsContainers.length;i++){
			
			var organ = organsContainers.children[i];
			for(var  u = 0; u < tagsToUse.length;u++){		
				var tag = tagsToUse[u];
				if(tag == organ.tag){
					return i;
				}
			}
		}
	}

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width, game.world.height,'atlas.zombie','pared');
		sceneGroup.add(background);

		addGradient(game.world.width, 660, 0,0,0,660, "#c68b97", "#000000", 0, 0, 0.5, 0,0);

		floor = game.add.tileSprite(0,game.world.height,game.world.width, 300,'atlas.zombie','piso');
		floor.anchor.setTo(0,1);
		sceneGroup.add(floor);

		addGradient(game.world.width, 300, 0,100,0,0, "#6dd1c2", "#000000", 0, 660, 0.5, 0,0);
		
		var eyesSign = sceneGroup.create(game.world.centerX + 200,game.world.centerY - 150,'atlas.zombie','ojos');
		eyesSign.anchor.setTo(0.5,0.5);

		addGradient(eyesSign.width, eyesSign.height, 0,0,0,400, "#FFFFFF", "#000000", eyesSign.x, eyesSign.y, 0.6, 0.5,0.5);

		var yogoSign = sceneGroup.create(game.world.centerX - 100,game.world.centerY - 320,'atlas.zombie','poster_theff');
		yogoSign.anchor.setTo(0.5,0.5);
		yogoSign.scale.setTo(-1,1);
		
		var weight = sceneGroup.create(game.world.centerX -200,game.world.height - floor.height * 0.9,'atlas.zombie','basculita');
		weight.anchor.setTo(0.5,1);

		var ligth = sceneGroup.create(game.world.centerX*0.25,0,'atlas.zombie','lights');
		game.add.tween(ligth).to( { alpha: 0}, 500, Phaser.Easing.Bounce.InOut, true, 0, -1, 500, true);
		var ligth2 = sceneGroup.create(game.world.centerX*1.25,0,'atlas.zombie','lights');
		game.time.events.add(100,function(){
			game.add.tween(ligth2).to( { alpha: 0}, 500, Phaser.Easing.Bounce.InOut, true, 0, -1, 500, true);
		});
		
	}

	function addGradient(width, height, linea,lineb,linec,lined, colorA, colorB, x, y, alpha, anchorx, anchory){
		var myBmp = game.add.bitmapData(width, height);
	    var myGrd = myBmp.context.createLinearGradient(linea, lineb, linec, lined);
	    myGrd.addColorStop(0, colorA);
	    myGrd.addColorStop(1, colorB);
	    myBmp.context.fillStyle = myGrd;
	    myBmp.context.fillRect(0, 0, width, height);
	    var grandientSpr = game.add.sprite(x, y, myBmp);
	    grandientSpr.anchor.setTo(anchorx, anchory)
	    grandientSpr.alpha = alpha;
	    sceneGroup.add(grandientSpr);
	}
	
	function inputButton(obj){
		
		if(!gameActive){
			return;
		}
		
		var positions = '';
		for(var i = 0; i < organsGroup.length;i++){
			
			var organ = organsGroup.children[i];
			positions+= '{name: "' + organ.tag + '" ,x:' + (game.world.centerX - organ.x) + ', y:' + (game.world.centerY - organ.y) + '},\n';
		}
	}
	
	function createZombie(){
		
		zombieSpine = game.add.spine(game.world.centerX, game.world.height - 250,'zombie');
		zombieSpine.alpha = 0;
		zombieSpine.setSkinByName('normal');
		zombieSpine.setAnimationByName(0,"IDLE",true);
		sceneGroup.add(zombieSpine);
		
		xContainer = sceneGroup.create(game.world.centerX,game.world.centerY,'atlas.zombie','container');
		xContainer.anchor.setTo(0.5,0.5);
		xContainer.scale.x = 1.2;
		xContainer.alpha = 0;
		
		var xZombie = game.add.sprite(zombieSpine.x,zombieSpine.y + 35, 'zombie');
		sceneGroup.add(xZombie);
		xZombie.animations.add('walk');
		xZombie.animations.play('walk',12,true);
		xZombie.alpha = 0;
		xZombie.anchor.setTo(0.5,1);
		
		zombieSpine.anim = xZombie;

		hand = game.add.sprite(0, 0, "hand");
        hand.animations.add('hand');
        hand.animations.play('hand', 24, true);
        hand.alpha = 0;
	}
	
	function createOrgans(){
		
		oContainer = new Phaser.Graphics(game);
		oContainer.alpha = 0;
        oContainer.beginFill(0x000000);
        oContainer.drawRoundedRect(game.world.centerX,game.world.height - 125,600, 220,12);
		oContainer.x-= oContainer.width * 0.5;
		oContainer.y-= oContainer.height * 0.5;
        oContainer.endFill();
		sceneGroup.add(oContainer);
		
		organsContainers = game.add.group();
		sceneGroup.add(organsContainers);
		
		for(var i = 0; i < organsPosition.length;i++){
			
			var orgGroup = game.add.group();
			orgGroup.x = -organsPosition[i].x + game.world.centerX;
			orgGroup.y = -organsPosition[i].y + game.world.centerY;
			orgGroup.tag = organsPosition[i].name;
			orgGroup.alpha = 0;
			orgGroup.active = false;
			organsContainers.add(orgGroup);
			
			var organ = orgGroup.create(0,0,'atlas.zombie',organsPosition[i].name);
			organ.anchor.setTo(0.5,0.5);
			organ.scale.setTo(1.1,1.1);
			organ.tint = 0xff0000;
			
			var organ = orgGroup.create(0,0,'atlas.zombie',organsPosition[i].name);
			organ.anchor.setTo(0.5,0.5);
			orgGroup.organ = organ;
			organ.tint = 0x000000;
									
		}
		
		organsGroup = game.add.group();
		sceneGroup.add(organsGroup);
		
		for(var i = 0; i < organsPosition.length;i++){
			
			var organ = organsGroup.create(-200,-100,'atlas.zombie',organsPosition[i].name);
			organ.inputEnabled = true;
			organ.input.enableDrag();//true
			organ.hitArea = new Phaser.Circle(0,0,organ.width*1.3);
			organ.tag = organsPosition[i].name;
			organ.anchor.setTo(0.5,0.5);
			organ.events.onDragStart.add(onDragStart, this);
			organ.events.onDragStop.add(onDragStop, this);

		}
		
	}

	function activateOrgans(value){
		for(var i = 0; i < organsGroup.length;i++){
		 	organsGroup.children[i].input.draggable = value;
		}
	}
	
	function onDragStart(obj){
		
		objToUse = obj;
		
		if(nameOrgan.tween){
			nameOrgan.tween.stop();
			nameOrgan.alpha = 0;
		}
		
		nameOrgan.alpha = 1;
		game.add.tween(nameOrgan.scale).from({x:0, y:0},250,Phaser.Easing.linear,true);
		nameOrgan.x = obj.x;
		nameOrgan.y = obj.y - 75;
		
		nameOrgan.tween = game.add.tween(nameOrgan).to({alpha:0},500,"Linear",true,1000);
		
		nameOrgan.text.setText(localization.getString(localizationData,obj.tag));
        
        sound.play("drag");

        obj.bringToTop();
        sceneGroup.bringToTop(organsGroup);
        sceneGroup.bringToTop(nameOrgan);
        sceneGroup.bringToTop(particleCorrect);
    }
	
	function onDragStop(obj){
		
		if(nameOrgan.tween){
			nameOrgan.tween.stop();
			nameOrgan.tween = game.add.tween(nameOrgan).to({alpha:0},500,"Linear",true);
		}
		
		objToUse = null;
		sound.play("pop");
		obj.inputEnabled = false;
		
		for(var i = 0; i < organsContainers.length;i++){
			
			var organ = organsContainers.children[i];
			if(checkOverlap(obj,organ) && obj.tag == organ.tag && gameActive && organ.active){
				
				game.add.tween(obj).to({x:organ.x, y:organ.y, angle:obj.angle + 360},500,"Linear",true).onComplete.add(function(){
					game.add.tween(obj).to({alpha: 0},500,"Linear",true);
					game.add.tween(organ).to({alpha: 0},500,"Linear",true);
				});
				//game.add.tween(obj).to({angle:obj.angle+360},500,"Linear",true);

				particleCorrect.x = obj.x;
                particleCorrect.y = obj.y;
                particleCorrect.start(true, 800, null, 5);
                if(levelZero){
                	sound.play("magic");
                	game.add.tween(hand).to( { alpha: 0 }, 300, Phaser.Easing.Bounce.In, true, 0, 0);
                	levelZero = false;
                }else{
                	addCoin(obj);
                }
				
				numberOk++;

				if(numberOk == numberOrgans){
					
					if(clock.tween!=null){
						clock.tween.stop();
					}
					
					game.add.tween(clock).to({alpha:0},500,"Linear",true);
					
					game.time.events.add(1500,function(){
						
						desappearOrgans();
						
						game.add.tween(oContainer).to({alpha:0},500,"Linear",true);
						
						sound.play("steam");
						game.add.tween(zombieSpine.anim).to({alpha:0},100,"Linear",true,0,5);
						game.add.tween(xContainer).to({alpha:0,y:xContainer.y - 200},500,"Linear",true,1000).onComplete.add(function(){
							
							sound.play("zombieUp");
							zombieSpine.setAnimationByName(0,"WALK",true);
							game.add.tween(zombieSpine).to({x:game.world.width + 300},2000,"Linear",true).onComplete.add(function(){
								
								zombieSpine.x = game.world.centerX;
								zombieSpine.alpha = 0;
								
								if(timeToUse > 2000){ //3000
									timeToUse-= 900//750;
								}
								
								if(numberOrgans < organsPosition.length){//7){
									numberOrgans++;							
								}
								
								game.time.events.add(1000,setOrgans);
							})
						})
					})
					
				}
				
				return
			}
		}
		
		if(obj.alpha == 1){
			game.add.tween(obj).to({x:obj.origX, y:obj.origY},500,"Linear",true).onComplete.add(function(){
			obj.inputEnabled = true;
			})
		}
	}
		
	function checkOverlap(spriteA, spriteB) {

		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();
		boundsB.width=boundsB.width/3.3;
        boundsB.height=boundsB.height/3.3;

		return Phaser.Rectangle.intersects(boundsA , boundsB);

    }
	
	function createClock(){
        
        clock = game.add.group();
        clock.x = game.world.centerX;
        clock.y = 100;
		clock.alpha = 0;
        sceneGroup.add(clock);
        
        var clockImage = clock.create(0,0,'atlas.zombie','clock');
        clockImage.anchor.setTo(0.5,0.5);
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.zombie','bar');
        clockBar.anchor.setTo(0,0.5);
        clockBar.width = clockImage.width*0.76;
        clockBar.height = 22;
        clockBar.origScale = clockBar.scale.x;
        
        clock.bar = clockBar;
        
    }
	
	function createNameOrgans(){
		
		nameOrgan = game.add.group();
		nameOrgan.x = game.world.centerX;
		nameOrgan.y = game.world.centerY;
		nameOrgan.alpha = 0;
		sceneGroup.add(nameOrgan);
		
		var image = nameOrgan.create(0,0,'atlas.zombie','contenedor_nombres');
		image.anchor.setTo(0.5,0.5);
		
		var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"};
		
        var pointsText = new Phaser.Text(sceneGroup.game, 0, -15, "0", fontStyle);
		pointsText.anchor.setTo(0.5,0.5);
		pointsText.lineSpacing = -10;
        nameOrgan.add(pointsText);
		
		nameOrgan.text = pointsText;
		
	}
	
	return {
		
		assets: assets,
		name: "drzombie",
		update: update,
        getGameData:function () { 
        	var games = yogomeGames.getGames(); 
        	return games[gameIndex];
        },
		create: function(event){
            
			sceneGroup = game.add.group();
			
			createBackground();

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

			createZombie();
			createOrgans();
			createClock();
			createNameOrgans();
                        			
            createHearts();
            createPointsBar();
            createCoin();
            createTutorial();
            createParticles();
			
			buttons.getButton(spaceSong,sceneGroup);
            
		}
	}
}()