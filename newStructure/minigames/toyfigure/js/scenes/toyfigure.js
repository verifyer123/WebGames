var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/toyfigure/";
var tutorialPath = "../../shared/minigames/"

var toyfigure = function(){

	assets = {
        atlases: [                
			{
                name: "atlas.toy",
                json: "images/toyfigure/atlas.json",
                image: "images/toyfigure/atlas.png",
			},
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
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
				file: soundsPath + "explode.mp3"},
			{	name: "shootBall",
				file: soundsPath + "shootBall.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"}
		],
	}
    
	var INITIAL_LIVES = 3
	sceneGroup = null;
    var INITIAL_TOYS = 6
    var DELTA_TOYS = 4
    var MAX_TOYS = 18

    var COINS_TO_TIME = 14

	
	var speedGame = 5;
	var background;
	var heartsGroup = null;
	var heartsIcon;
	var heartsText;	
	var xpIcon;
	var lives = INITIAL_LIVES;
	var cursors;
	var coins = 0;
	var activeGame = true;
    var repizasArray = new Array;
    var goodAnswer = 0;
    var time = 60;
    var timerBar = null;
    var gameIndex = 55;
    var currentToys

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
    
    
    function getRandomArbitrary(min, max) {
  		return Math.floor(Math.random() * (max - min) + min);
	}
	
	styleWhite = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	styleBlack = {font: "80px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
	styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };

    function preload() {
		game.load.audio('sillyAdventureGameLoop',  soundsPath + 'songs/sillyAdventureGameLoop.mp3');
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
		
		/*GAME*/
		game.load.image("background",imagePath + "background.png");
        game.load.image("floor",imagePath + "floor.png");
        game.load.image("clock",imagePath + "clock.png");
        game.load.image("star",imagePath + "star.png");
        game.load.image("barra",imagePath + "barra.png");

		/*SPINE*/
		game.load.spine("dinamita", imagePath + "spine/dinamita.json");

        game.load.image('tutorial_image',imagePath+"/tutorial_image.png")
        //loadType(gameIndex)


		
		
		
	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}
	
	function initialize(){
		lives = INITIAL_LIVES;
		coins = 0;
		speedGame = 5;
		starGame = false;
        currentToys = INITIAL_TOYS
	}	

	/*CREATE SCENE*/
    function createScene(){
        initialize()
		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
		loadSounds();
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		var background = sceneGroup.create(-100,-100,"background");
        background.width = game.width*2;
        background.height = game.height*2;
        
		var floor = sceneGroup.create(0,game.height/1.5,"floor");
        floor.anchor.setTo(0,0);
        floor.width = game.width;
        floor.height = game.height*2;
        
        var bed = sceneGroup.create(0,0,"atlas.toy","cama.png");
        bed.x = game.width - bed.width;
        bed.y = floor.y - bed.height/1.9;
        
        var santo = sceneGroup.create(0,0,"atlas.toy","elsanto.png");
        santo.x = game.width - santo.width* 1.2;
        santo.y = bed.y - santo.height*1.1;        
        
        var dinamita = game.add.spine(0,0,"dinamita");
        dinamita.setAnimationByName(0, "IDLE", true);
		dinamita.setSkinByName("normal");
        dinamita.scale.setTo(-1,1);
        dinamita.x =   bed.x - dinamita.width;
        dinamita.y = bed.y + dinamita.height/1.2;        
        sceneGroup.add(dinamita);
        
        var clock = sceneGroup.create(0,0,"clock");
        clock.anchor.setTo(0.5,0.5);
        clock.x = game.world.centerX;
        clock.y = game.height - clock.height/1.5;
        clock.alpha = 0;
        
        var barra = sceneGroup.create(0,0,"barra");
        barra.anchor.setTo(0,0.5);
        barra.x = game.world.centerX - barra.width/2;
        barra.y = game.height - clock.height/2.2; 
        barra.scale.setTo(0,1);
        barra.alpha = 0;
 
        
        var newPositionRepiza = new Array;
        
        for(var i = 0; i<=8;i++){
            repizasArray[i] = sceneGroup.create(-150,-150,"atlas.toy","repizas" + i + ".png");
            repizasArray[i].anchor.setTo(0.5,0.5);
            this.game.physics.arcade.enable(repizasArray[i]);
            repizasArray[i].id = i;
            newPositionRepiza[i] = repizasArray[i];
            newPositionRepiza[i].currentSetToy = 0

        }
        
        var position0x = 0 + repizasArray[0].width/1.5;
        var position0y = game.world.centerY - repizasArray[0].height*2.2;
        
        if(isMobile.any()){
            var position1x = 0 + repizasArray[0].width*1.9;
           
           }else{
               var position1x = game.world.centerX - repizasArray[0].width/2;
           }
        
        
        var position1y = game.world.centerY - repizasArray[0].height*2.2; 
        
        var position2x = game.world.centerX + repizasArray[0].width*1.2;
        var position2y = game.world.centerY - repizasArray[0].height*2.2;
        
        var position3x = 0 + repizasArray[0].width/1.5;
        var position3y = game.world.centerY - repizasArray[0].height;  
        
        var position4x = 0 + repizasArray[0].width*1.9;
        var position4y = game.world.centerY - repizasArray[0].height; 
        
        var position5x = 0 + repizasArray[0].width/1.5;
        var position5y = game.world.centerY + repizasArray[0].height/8;          
        
        var toysArray = new Array;
        var typeToys = new Array;
        
        
        
        for(var p = 0; p<= 17;p++){
            toysArray[p] = sceneGroup.create(-150,-150,"atlas.toy","toy" + p + ".png");
            toysArray[p].anchor.setTo(0.5,0.5);

			this.game.physics.arcade.enable(toysArray[p]);
			toysArray[p].inputEnabled = true;
			toysArray[p].originalPosition = toysArray[p].position.clone();
			toysArray[p].input.enableDrag(); 
        }
        
       
        coins = 0
        

toysArray[0].id = 0;
toysArray[1].id = 0;
toysArray[2].id = 1;
toysArray[3].id = 1;
toysArray[4].id = 2;
toysArray[5].id = 2;     
toysArray[6].id = 3;
toysArray[7].id = 3;    
toysArray[8].id = 4;
toysArray[9].id = 4;      
toysArray[10].id = 5;
toysArray[11].id = 5;          
toysArray[12].id = 6;
toysArray[13].id = 6;       
toysArray[14].id = 7;
toysArray[15].id = 7;      
toysArray[16].id = 8;
toysArray[17].id = 8;   
        
        
toysArray[0].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[0]);}, this);
toysArray[1].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[0]);}, this);  
        
toysArray[2].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[1]);}, this);
toysArray[3].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[1]);}, this); 
        
toysArray[4].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[2]);}, this);
toysArray[5].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[2]);}, this);        
toysArray[6].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[3]);}, this);
toysArray[7].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[3]);}, this);        
toysArray[8].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[4]);}, this);
toysArray[9].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[4]);}, this);        
toysArray[10].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[5]);}, this);
toysArray[11].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[5]);}, this);        
toysArray[12].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[6]);}, this);
toysArray[13].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[6]);}, this);        
toysArray[14].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[7]);}, this);
toysArray[15].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[7]);}, this);        
toysArray[16].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[8]);}, this);
toysArray[17].events.onDragStop.add(function(currentSprite){stopDrag(currentSprite,repizasArray[8]);}, this);        

        var star = sceneGroup.create(0,0,"star");
        star.anchor.setTo(0.5,0.5);
        star.alpha = 0;

        function stopDrag(currentSprite, endSprite){   
            //console.log(currentSprite.id);
            
            if (!this.game.physics.arcade.overlap(currentSprite, endSprite, function() {
                currentSprite.input.draggable = false;
                TweenMax.to(currentSprite,0.4,{x:endSprite.x,y:endSprite.y});
                star.x = endSprite.x;
                star.y = endSprite.y;
                TweenMax.fromTo(star.scale,0.5,{x:1,y:1},{x:2,y:2});
                TweenMax.fromTo(star,0.5,{alpha:1},{alpha:0});
                TweenMax.to(currentSprite.scale,0.5,{x:0,y:0,delay:0.5});
                coins++;
                xpText.setText(coins);
                goodAnswer++;
                console.log("Id sprote dragged "+currentSprite.id)
                for(var i = 0; i<=8;i++){
                    if(currentSprite.id == newPositionRepiza[i].id){
                        newPositionRepiza[i].currentSetToy++
                    }
                }

                moreToys();
                sound.play("magic");
                
          })) { 
                if(currentSprite.y <= floor.y){
                    TweenMax.to(currentSprite,1,{x:currentSprite.positionX,y:currentSprite.positionY});
                }
                
                if(currentSprite.x <= 0){
                    TweenMax.to(currentSprite,1,{x:currentSprite.positionX,y:currentSprite.positionY});     
                }
          }
          }        
        
       
        function timerClock(){

            clock.alpha = 1;
            barra.alpha = 1;

            timerBar = TweenMax.fromTo(barra.scale,time,{x:0},{x:1,onComplete:finishGame});
        }
        
        function finishGame(){
            lives--
            setLives(lives)
            if(lives<=0){
                for(var p = 0; p<= 17;p++){
                    toysArray[p].input.draggable = false;
                }    
                
                TweenMax.to(game,1,{alpha:0,onComplete:gameOver});
                sound.play("wrong");
                sound.play("gameLose");
                dinamita.setAnimationByName(0, "LOSE", true); 
                bgm.stop();	
            }
            else{
                sound.play("wrong");
                dinamita.setAnimationByName(0, "LOSE", true); 
                for(var p = 0; p<= 17;p++){
                    TweenMax.to(toysArray[p],0.2,{alpha:0})
                }   

                for(var i = 0; i<=8;i++){
                    TweenMax.to(newPositionRepiza[i],0.2,{alpha:0})
                }

                game.time.events.add(800,choiceToy)
            }
        }	
        
	
		
		function gameOver(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,gameIndex)
			sceneloader.show("result");
		}
        
        
        function choiceToy(){

            /*for(var p = 0; p<= 17;p++){
                TweenMax.to(toysArray[p],0.5,{alpha:1,onComplete:choiceToy})
            }*/

            dinamita.setAnimationByName(0, "IDLE", true); 
            if(coins >= COINS_TO_TIME){
                if(time >= 20){
                   time = time - 5; 
                }
                timerClock();
            }
            
            goodAnswer = 0;



             for(var i = 0; i<=8;i++){
                newPositionRepiza[i].alpha = 1
                newPositionRepiza[i].x = -450;
                newPositionRepiza[i].y = -450;
                newPositionRepiza[i].currentSetToy = 0
                newPositionRepiza[i].canTween = true
             }
            
            
            shuffle(newPositionRepiza);
            var toysIds = []
             for(var i = 0; i<3;i++){
                newPositionRepiza[i].x = eval("position" +[i] + "x");
                newPositionRepiza[i].y = eval("position" +[i] + "y");  
                TweenMax.fromTo(newPositionRepiza[i].scale,0.5,{x:0,y:0},{x:1,y:1,delay:i*0.2}); 
                if(toysIds.indexOf(newPositionRepiza[i].id)==-1){
                    toysIds.push(newPositionRepiza[i].id)
                }
             }

            for(var i = 3; i < currentToys/2; i++){
                 if(toysIds.indexOf(newPositionRepiza[i].id)==-1){
                    toysIds.push(newPositionRepiza[i].id)
                }
            }
 
            
            for(var p = 0; p<= 17;p++){
                if(toysIds.indexOf(toysArray[p].id)==-1){
                    continue
                }
                toysArray[p].scale.setTo(1,1);
                toysArray[p].alpha = 1
                toysArray[p].x = getRandomArbitrary(0 + toysArray[p].width/2, game.world.centerX*1.5 - toysArray[p].width/2);
                toysArray[p].y = getRandomArbitrary(floor.y , clock.y - toysArray[p].width/2);
                toysArray[p].positionX = toysArray[p].x;
                toysArray[p].positionY = toysArray[p].y;
                toysArray[p].input.draggable = true;
                TweenMax.fromTo(toysArray[p],1,{y:-150},{y:toysArray[p].positionY,delay:p*0.05,ease:Bounce.easeOut});
            }
            
        }
        
        choiceToy();
        
        function moreToys(){
            console.log(goodAnswer,currentToys)
            if(goodAnswer == currentToys){
                if(currentToys<MAX_TOYS){
                    currentToys+=DELTA_TOYS
                }
                TweenMax.fromTo(star.scale,3,{x:2,y:2},{x:4,y:4});
                star.x = game.world.centerX;
                star.y = game.world.centerY;
                TweenMax.fromTo(star,3,{alpha:1},{alpha:0,onComplete:nextToys});
                dinamita.setAnimationByName(0, "WIN", true);
                if(timerBar != null){
                   timerBar.kill(); 
                }
                
                function nextToys(){
                    sound.play("combo");
                 choiceToy();   
                dinamita.setAnimationByName(0, "IDLE", true);    
                }

                return
                
            }


            if(currentToys>6){
                if(goodAnswer == 5){
                    
                    newPositionRepiza[3].x = eval("position" +[3] + "x");
                    newPositionRepiza[3].y = eval("position" +[3] + "y"); 
                    TweenMax.fromTo(newPositionRepiza[3].scale,0.5,{x:0,y:0},{x:1,y:1,delay:0.5});
                }  

                if(goodAnswer == 7){
                    
                    newPositionRepiza[4].x = eval("position" +[4] + "x");
                    newPositionRepiza[4].y = eval("position" +[4] + "y"); 
                    TweenMax.fromTo(newPositionRepiza[4].scale,0.5,{x:0,y:0},{x:1,y:1,delay:0.5});
                }   
            }
            
            if(currentToys>10){
                if(goodAnswer == 9){
                    
                    newPositionRepiza[5].x = eval("position" +[5] + "x");
                    newPositionRepiza[5].y = eval("position" +[5] + "y"); 
                    TweenMax.fromTo(newPositionRepiza[5].scale,0.5,{x:0,y:0},{x:1,y:1,delay:0.5});
                }   
            }
            
            /*if(goodAnswer == 12){
                var changeToy = 3
                newPositionRepiza[6].x = eval("position" +[changeToy] + "x");
                newPositionRepiza[6].y = eval("position" +[changeToy] + "y"); 
                TweenMax.fromTo(newPositionRepiza[changeToy].scale,0.5,{x:1,y:1},{x:0,y:0});
                TweenMax.fromTo(newPositionRepiza[6].scale,0.5,{x:0,y:0},{x:1,y:1,delay:0.5});
            }     
            if(goodAnswer == 14){
                var changeToy = 4
                newPositionRepiza[7].x = eval("position" +[changeToy] + "x");
                newPositionRepiza[7].y = eval("position" +[changeToy] + "y"); 
                TweenMax.fromTo(newPositionRepiza[changeToy].scale,0.5,{x:1,y:1},{x:0,y:0});
                TweenMax.fromTo(newPositionRepiza[7].scale,0.5,{x:0,y:0},{x:1,y:1,delay:0.5});
            }       
            if(goodAnswer == 16){
                var changeToy = 5
                newPositionRepiza[8].x = eval("position" +[changeToy] + "x");
                newPositionRepiza[8].y = eval("position" +[changeToy] + "y"); 
                TweenMax.fromTo(newPositionRepiza[changeToy].scale,0.5,{x:1,y:1},{x:0,y:0});
                TweenMax.fromTo(newPositionRepiza[8].scale,0.5,{x:0,y:0},{x:1,y:1,delay:0.5});
                
            } */

            if(goodAnswer== 11 || goodAnswer == 13 || goodAnswer == 15){
                if(goodAnswer+1 == currentToys){
                    return
                }
                var changeToy

                var randomIds = [0,1,2,3,4,5]
                shuffle(randomIds)

                 for(var i = 0; i<randomIds.length;i++){
                    if(newPositionRepiza[randomIds[i]].currentSetToy>=2 && newPositionRepiza[randomIds[i]].canTween){
                        newPositionRepiza[randomIds[i]].canTween = false
                        changeToy = randomIds[i]
                        break
                    }
                }
                console.log(changeToy)
                var currentRepiza = (goodAnswer+1)/2
                newPositionRepiza[currentRepiza].x = eval("position" +[changeToy] + "x");
                newPositionRepiza[currentRepiza].y = eval("position" +[changeToy] + "y"); 
                console.log(newPositionRepiza[changeToy])
                TweenMax.fromTo(newPositionRepiza[changeToy].scale,0.5,{x:1,y:1},{x:0,y:0});
                TweenMax.fromTo(newPositionRepiza[currentRepiza].scale,0.5,{x:0,y:0},{x:1,y:1,delay:0.5});
            }
            
            
            
        }
        
        
		createCoins(coins);
		createHearts(lives);
		createOverlay(lives);
		
	}

    


	
	function update() {
		
	}
		

	
	
	return {
		assets: assets,
		name: "toyfigure",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()