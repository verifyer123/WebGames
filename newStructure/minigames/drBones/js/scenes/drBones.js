var soundsPath = "../../shared/minigames/sounds/";

var drBones = function(){
    
    //#region Assets

    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left", 
            "humero":"Humerus",
            "femur":"Femur",
            "radio":"Radio",
            "costilla":"Rib",
            "tibia":"Tibia",
            "pelvis":"Pelvis",           
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "humero":"Húmero",
            "femur":"Fémur",
            "radio":"Radio",
            "costilla":"Costilla",
            "tibia":"Tibia",
            "pelvis":"Pelvis",
		}
	}       

    var assets = {
        atlases: [
            {   
                name: "atlas.drBones",
                json: "images/drBones/atlas.json",
                image: "images/drBones/atlas.png",
            },
            {
                name: "timeAtlas.drBones",
                json: "images/drBones/timeAtlas.json",
                image: "images/drBones/timeAtlas.png"
            }
        ],
        images: [
            {   name: "background",
                file: "images/drBones/PREVIEW.png"
            },
            {   name: "XRayTable",
                file: "images/drBones/XRayScreen.png"
            },
            {
                name: "textXRay",
                file: "images/drBones/UpperScreen.png"
            }
            /*{   name:"tutorial_image",
                file: "images/drBones/gametuto.png"}*/
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
               file: "images/drBones/coin.png",
               width: 122,
               height: 123,
               frames: 12
            },
            {   name: "hand",
               file: "images/drBones/hand.png",
               width: 115,
               height: 111,
               frames: 23
           }
        ],
		spines:[
            {
                name:"skeleton",
                file:"images/spines/skeleton_front.json"
            },
            {
                name: "skeletonSide",
                file: "images/spines/skeleton_side.json"
            }
        ]
    }

    //#endregion
   
    //#region DefaultFunctions

    var lives = null;
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

	function loadSounds(){
		sound.decode(assets.sounds);
	}

	function initialize(){
        lives = 3;
        game.stage.backgroundColor = "#ffffff";        
        loadSounds();        
    }
    
	function preload(){
        game.stage.disableVisibilityChange = false;
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

    function update(){
	}

	function createPointsBar(){        
        pointsBar = game.add.group();
        pointsBar.x = game.world.width;
        pointsBar.y = 0;
        sceneGroup.add(pointsBar);
        
        var pointsImg = pointsBar.create(-10,10,'atlas.drBones','xpcoins');
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

        var heartImg = group.create(0,0,'atlas.drBones','life_box');

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

        particle.makeParticles('atlas.drBones',key);
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

    
    function createTimer(){

       timerGroup = game.add.group();
       //timerGroup.alpha = 0
       sceneGroup.add(timerGroup);

       var clock = timerGroup.create(game.world.centerX, 100, "timeAtlas.drBones", "clock");//75
       clock.anchor.setTo(0.5);

       var timeBar = timerGroup.create(clock.centerX - 175, clock.centerY + 19, "timeAtlas.drBones", "bar");
       timeBar.anchor.setTo(0, 0.5);
       timeBar.scale.setTo(11.5, 0.65);
       timerGroup.timeBar = timeBar;
    }

    //#endregion
    
    //#region CreateBoard
    
    //var grpXRayBoard = null;    
    //var middleX = game.world.width/2; var middleY = game.world.height/2;
    var middleX = 0; var middleY = 0;
    var bones = ["humero","femur","radio","costilla","tibia","pelvis"];
    var posBones = {
                    "0":{"posBkgX":-350, "posBkgY":350, "numPzlPiece": 5, "minPosPieceX": 100, "maxPosPieceX": 300,"minPosPieceY": 100, "maxPosPieceY": 300},
                    "1":{"posBkgX":-150, "posBkgY":-50, "numPzlPiece": 5, "minPosPieceX": 100, "maxPosPieceX": 300,"minPosPieceY": 100, "maxPosPieceY": 300},

                    "2":{"posBkgX":-450, "posBkgY":250, "numPzlPiece": 5, "minPosPieceX": 50, "maxPosPieceX": 150,"minPosPieceY": -160, "maxPosPieceY": 50},

                    "3":{"posBkgX":0,    "posBkgY":250, "numPzlPiece": 5, "minPosPieceX": 100, "maxPosPieceX": 300,"minPosPieceY": 100, "maxPosPieceY": 300},
                    "4":{"posBkgX":-150, "posBkgY":50,  "numPzlPiece": 5, "minPosPieceX": 100, "maxPosPieceX": 300,"minPosPieceY": 100, "maxPosPieceY": 300},
                    "5":{"posBkgX":0,    "posBkgY":150, "numPzlPiece": 5, "minPosPieceX": 100, "maxPosPieceX": 300,"minPosPieceY": 100, "maxPosPieceY": 300}
                   };    
    var grpPuzzle = null;/* var grFemur = null; var grRadio = null;
    var grRib = null; var grTibia = null; var grPelvis = null;*/
    var txtBone = null;
    var imgTableXRay = null; var imgPuzzleBoard = null;
    var skeleton = null; var skeletonF = null;
    var fontBone = {font: "65px VAGRounded", fontWeight: "bold", fill: "#66CBC4", align: "center"};

    function createDinamicBoard(){ 
        createTimer();
        //setBoneToPlay();        
    }

    function createStaticBoard(){
        setXRay();
        loadSkeletons();
        createDinamicBoard();
    }    

    function loadSkeletons(){
        skeleton = game.add.spine((imgTableXRay.width/2) + 550, game.world.centerY + 150, "skeletonSide");       
        skeleton.setSkinByName("normal");                
        skeleton.setAnimationByName(0, "WALK", true);
        //skeleton.state.timeScale = 0;

        skeletonF = game.add.spine(imgTableXRay.width/2, game.world.centerY + 135, "skeleton");
        skeletonF.setSkinByName("normal");  
        skeletonF.setAnimationByName(0, "IDLE", true);      
        skeletonF.alpha = 0;        

        imgTableXRay.addChild(skeleton);
        imgTableXRay.addChild(skeletonF);
        setSkeletonOnBoard();
    }

    function transitionAlpha(object, alphaValue, time){
        var alphaObj = game.add.tween(object).to( { alpha: alphaValue }, time, Phaser.Easing.Linear.None, true, 0, 0, false);        
        return alphaObj;
    }

    function setSkeletonOnBoard(){
        //var tweenSk = animateObject(skeleton,game.world.centerX, game.world.centerY + 150, 2000);                
        var tweenSk = animateObject(skeleton,imgTableXRay.width/2, game.world.centerY + 150, 2000);                
        tweenSk.onComplete.add(function(){
            transitionAlpha(skeleton,0,800);
            game.time.events.add(600,function(){
                transitionAlpha(skeletonF,1,1000);
                skeletonF.setAnimationByName(0, "IDLE", false).onComplete = function(){
                    //Zoom y cambia imagen                   
                    animShowBoneToPlay();
                };
            },this);
        });
    }

    function animShowBoneToPlay(){        
        var boneToPlay = 2;//game.rnd.integerInRange(0,bones.length - 1);        
        txtBone.text = localizationData[localization.getLanguage()][bones[boneToPlay]];
        
        animateObject(skeletonF,middleX + posBones[boneToPlay.toString()]["posBkgX"], middleY + posBones[boneToPlay.toString()]["posBkgY"],2500);
        animScaleObject(skeletonF,2.8,2.8,2500);        
        
        game.time.events.add(2000, function(){
            transitionAlpha(skeletonF,0,1300); 
            imgPuzzleBoard.loadTexture("atlas.drBones", bones[boneToPlay], 0);
            transitionAlpha(imgPuzzleBoard,1,1300); 
            
            //createPuzzle(5);
            //getPuzzleGame(boneToPlay); 
            getPuzzle(boneToPlay);                       
        });
    }   

    function setRndPositionAndEnableButton(indexBoneToPlay){                        
        
    }

    function createInitialPuzzles(){
        //sceneGroup.add(getPuzzle(0,grHumerus));
        //sceneGroup.add(getPuzzle(1,grFemur));
        sceneGroup.add(getPuzzle(2,grRadio));
        //sceneGroup.add(getPuzzle(3,grRib));
        //sceneGroup.add(getPuzzle(4,grTibia));
        //sceneGroup.add(getPuzzle(5,grPelvis));
    }   

    function getPuzzle(bonePuzzle){
        grpPuzzle = new Phaser.Group(game);
        var strIndexToPlay = bonePuzzle.toString();

        for (var i = 0; i < posBones[strIndexToPlay]["numPzlPiece"]; i++){
            var imgPiece = grpPuzzle.create(0,0,'atlas.drBones',bones[bonePuzzle] + i);
            imgPiece.x = game.world.centerX + game.rnd.integerInRange(posBones[strIndexToPlay]["minPosPieceX"],posBones[strIndexToPlay]["maxPosPieceX"]);
            imgPiece.y = game.world.centerY + game.rnd.integerInRange(posBones[strIndexToPlay]["minPosPieceY"],posBones[strIndexToPlay]["maxPosPieceY"]);
            imgPiece.inputEnabled = true;
            imgPiece.input.enableDrag();
            //imgPiece.input.enableSnap(90,90,false,true);
            imgPiece.events.onDragStop.add(fixLocationDrag);
            //imgPiece.alpha = 0;
        }   
        sceneGroup.add(grpPuzzle);     
    }    

    function fixLocationDrag(item){
         // Move the items when it is already dropped.
        console.log("x = " + item.x + " y = " + item.y);
         if (item.x < 35) {
            //item.x = 40;
            //item.input.disableDrag();
            item.x = 40;  
            //item.input.enableDrag();          
        }
        if (item.x > 435) {
            //item.input.disableDrag();
            item.x = 430;
            //item.input.enableDrag();
        }
        if (item.y < 310) {
            //item.input.disableDrag();
            item.y = 315;
            //item.input.enableDrag();
        }
        if (item.y > 840){
            //item.input.disableDrag();
            item.y = 835;
            //item.input.enableDrag();
        }
    }

    function animScaleObject(objScale, toX, toY, time){  
        var tweenScale = game.add.tween(objScale.scale).to({x: toX, y: toY}, time, Phaser.Easing.linear, true);      
        return tweenScale;
    }

    function animateObject(objToAnimate, toX, toY, time){        
        var tweenObject = game.add.tween(objToAnimate).to({x: toX, y: toY}, time, Phaser.Easing.Linear.In, true, 0, 0);
        return tweenObject;
    }    

    function setXRay(){
        var grpXRayBoard = new Phaser.Group(game);                
        
        imgTableXRay = grpXRayBoard.create(0,0,'XRayTable');
        imgTableXRay.x = game.world.centerX - imgTableXRay.width * 0.5;
        imgTableXRay.y = game.world.centerY - imgTableXRay.height * 0.3;

        var imgTxtXRay = grpXRayBoard.create(0,0,'textXRay');
        imgTxtXRay.anchor.setTo(0.5,0.5);
        imgTxtXRay.x = game.world.centerX;
        imgTxtXRay.y = game.world.centerY - 250;

        imgPuzzleBoard = grpXRayBoard.create(game.world.centerX, game.world.centerY + 130, "atlas.drBones", "humero");//75            
        imgPuzzleBoard.anchor.setTo(0.5,0.5);
        imgPuzzleBoard.alpha = 0;
        
        //setBoneToPlay();
        txtBone = game.add.text(imgTxtXRay.x,imgTxtXRay.y,"",fontBone);
        txtBone.anchor.setTo(0.5,0.5);

        setMaskOnXRayTable(imgTableXRay);
        sceneGroup.add(grpXRayBoard);       

        middleX = game.world.centerX;
        middleY = game.world.centerY;
    }  
    
    function setMaskOnXRayTable(image){        
        //var mask = game.add.graphics(image.x - image.width * 0.5, image.y - image.height * 0.5);    
        var mask = game.add.graphics(game.world.centerX - 235, game.world.centerY - 170);   //70,310 
        mask.beginFill(0xffffff,0.5);
        mask.drawRect(0,0,image.width - 90,image.height - 105); //90,105     
        image.mask = mask;
    }

    //#endregion

	return {
		
		assets: assets,
		name: "drBones",
		update: update,
        preload:preload,
        getGameData:function () { 
        	var games = yogomeGames.getGames(); 
        	return games[gameIndex];
        },
		create: function(event){
            
            sceneGroup = game.add.group();
            
            var back = game.add.tileSprite(0,0, game.world.width, game.world.height, 'atlas.drBones', 'TILE');//(0,0, game.world.width, game.world.height,'background');
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
            createStaticBoard();
            createParticles();            
			
			buttons.getButton(spaceSong,sceneGroup);//Agregar 2 parametros mas para mover en x y y
		}
	}
}()