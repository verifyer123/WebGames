var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/clockfix/";

var clockfix = function(){

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
				file: soundsPath + "combo.mp3"},
            {	name: "explosion",
				file: soundsPath +"explosion.mp3"},
			{	name: "windingClock",
				file: "sounds/windingclock.mp3"},
			{	name: "ClockCucko",
				file: "sounds/ClockCucko.mp3"}
			
		],
	}
    
	
	sceneGroup = null;
    
    function getRandomArbitrary(min, max) {
  		return Math.floor(Math.random() * (max - min) + min);
	}        
	
	var speedGame = 5;
	var background;
	var heartsGroup = null;
	var heartsIcon;
	var lives = 1;
	var cursors;
	var coins = 0;
	var activeGame = true;
    var manecilla1;
    var manecilla2;
    var dragging = false;
    var morning_swatch;
    var dia_swatch;
    var noche_swatch;
    var hour = getRandomArbitrary(0, 24);
    var minute = getRandomArbitrary(0, 12)*5;
    var morningBackground = true;
    var angleHour = 0 ;
    var angleMinute = 0;
    var answer = 0;
    var dclock;
    var targetAngle = 0;
    var NumwebGame = 55;
	
	styleWhite = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	styleBlack = {font: "80px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
    styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
	styleDigital = {font: "100px Digital", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };


    
    function preload() {
        game.input.maxPointers = 1;
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
		game.load.image("morning",imagePath + "morning.png");
        game.load.image("noche",imagePath + "noche.png");
        game.load.image("dia",imagePath + "dia.png");
        game.load.image("dia_swatch",imagePath + "dia_swatch.png");
        game.load.image("morning_swatch",imagePath + "morning_swatch.png");
        game.load.image("noche_swatch",imagePath + "noche_swatch.png");
        game.load.image("manecilla1",imagePath + "manecilla1.png");
        game.load.image("manecilla2",imagePath + "manecilla2.png");
        game.load.image("boton_manecillas",imagePath + "boton_manecillas.png");
        game.load.image("am",imagePath + "am.png");
        game.load.image("pm",imagePath + "pm.png");
        game.load.image("ok",imagePath + "ok.png");
        game.load.image("amOn",imagePath + "amOn.png");
        game.load.image("pmOn",imagePath + "pmOn.png");
        game.load.image("okOn",imagePath + "okOn.png");
		/*SPINE*/
		game.load.spine("aclock", imagePath + "spine/a_clock/a_clock.json");
        game.load.spine("dclock", imagePath + "spine/d_clock/d_clock.json");	
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
		sceneGroup = game.add.group();
		loadSounds();
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);
  
        var morning = sceneGroup.create(0,0,"morning");
        morning.width = game.width;
        morning_swatch = game.add.tileSprite(0,0,game.width,game.height,"morning_swatch");
		sceneGroup.add(morning_swatch);
  
        var dia = sceneGroup.create(0,0,"dia");
        dia.width = game.width;
        dia_swatch = game.add.tileSprite(0,0,game.width,game.height,"dia_swatch");
		sceneGroup.add(dia_swatch); 
        
        var noche = sceneGroup.create(0,0,"noche");
        noche.width = game.width;
        noche_swatch = game.add.tileSprite(0,0,game.width,game.height,"noche_swatch");
		sceneGroup.add(noche_swatch);
        
        dia.alpha = 0;
        dia_swatch.alpha = 0;
        noche.alpha = 0;
        noche_swatch.alpha = 0;  

        var aclock = game.add.spine(0,0,"aclock");
        aclock.setAnimationByName(0, "IDLE", true);
		aclock.setSkinByName("normal");
        aclock.x = game.world.centerX;
        aclock.y = game.world.centerY + aclock.height/3
        sceneGroup.add(aclock);
        
        
        
        dclock = game.add.spine(0,0,"dclock");
        dclock.setAnimationByName(0, "IDLE", true);
		dclock.setSkinByName("normal");
        dclock.x = game.world.centerX;
        dclock.y = game.world.centerY - dclock.height
        sceneGroup.add(dclock);
        

        
        var amButtonOff = sceneGroup.create(0,0,"am");
        amButtonOff.anchor.setTo(0.5,0.5);
        amButtonOff.y = dclock.y + amButtonOff.height;
        amButtonOff.x = game.width/3 - amButtonOff.width;
        
        
        var amButtonOn = sceneGroup.create(amButtonOff.x,amButtonOff.y,"amOn");
        amButtonOn.anchor.setTo(0.5,0.5);
        amButtonOn.inputEnabled = true;
        amButtonOn.active = true;
        amButtonOn.hour = true;
        amButtonOn.events.onInputDown.add(downButton,this);
        
        var pmButtonOff = sceneGroup.create(0,0,"pm");
        pmButtonOff.anchor.setTo(0.5,0.5);
        pmButtonOff.y = dclock.y + pmButtonOff.height;
        pmButtonOff.x = game.width - pmButtonOff.width;
        
        var pmButtonOn = sceneGroup.create(pmButtonOff.x,pmButtonOff.y,"pmOn");
        pmButtonOn.anchor.setTo(0.5,0.5);
        pmButtonOn.alpha = 0;        
        pmButtonOn.active = false;
        pmButtonOn.hour = false;
        pmButtonOn.inputEnabled = true;
        pmButtonOn.events.onInputDown.add(downButton,this);
        
        var buttonOkGroup = game.add.group();
        var okButtonOff = buttonOkGroup.create(0,0,"ok");
        okButtonOff.anchor.setTo(0.5,0.5);
        okButtonOff.y = dclock.y + pmButtonOff.height;
        okButtonOff.x = game.world.centerX;
        
        var okButtonOn = buttonOkGroup.create(okButtonOff.x,okButtonOff.y,"okOn");
        okButtonOn.anchor.setTo(0.5,0.5);
        okButtonOn.alpha = 0;  
        okButtonOn.active = false;
        okButtonOn.inputEnabled = true;
        okButtonOn.events.onInputDown.add(answerButton,this);
        sceneGroup.add(buttonOkGroup);
        
        function downButton(object){
            sound.play("pop");
            morningBackground = object.hour;
            okButtonOn.alpha = 0; 
            pmButtonOn.alpha = 0; 
            amButtonOn.alpha = 0; 

            if(object.active){
                object.alpha = 0;
                okButtonOn.active = false; 
                pmButtonOn.active = false; 
                amButtonOn.active = false;                 
               }else{
                object.alpha = 1;
                okButtonOn.active = false; 
                pmButtonOn.active = false; 
                amButtonOn.active = false; 
                object.active = true;
               }
            
            changeBackground();
            
        }
        
        function answerButton(object){
            if(object.active){
                object.active = false;
                object.alpha = 0;
            }else{
                object.active = true;
                object.alpha = 1;
            }

            console.log("hora:" + hour);
            console.log("minuto:" + minute);
            
            for(i=0;i<=12;i++){
                switch(hour){
                        case i:
                        case i + 12:
                              if(angleHour > (30*i - 10) && angleHour< (30*i + 10)){
                                  if(hour >= 12){
                                      if(!morningBackground){
                                          answer = answer + 1;
                                      }
                                  }else{
                                      if(morningBackground){
                                          answer = answer + 1;
                                      }
                                  }
                                  
                              }
                        break;
                  }  
                
                switch(minute){
                        case i * 5:
                              if(angleMinute > (30*i - 10) && angleMinute< (30*i + 10)){
                                  
                                  answer = answer + 1;
                              }
                        break;
                  }      
                
                
            }
            
            if(answer == 2){
                buttonOkGroup.alpha = 0;
                coins++;
                xpText.setText(coins);
                object.inputEnabled = false;
                okButtonOn.alpha = 0;
                sound.play("magic");
                sound.play("ClockCucko");
                if(morningBackground){
                    aclock.setAnimationByName(0, "WIN_MORNING", true);  
                    answer = 0;
                }else{
                    aclock.setAnimationByName(0, "WIN_NIGTH", true);
                    answer = 0;
                }
                TweenMax.to(manecilla1,3.5,{alpha:1,onComplete:newHour});
            }else{
                object.inputEnabled = false;
                TweenMax.to(manecilla1,0.5,{angle:180,ease:Back.easeOut});
                TweenMax.to(manecilla2,0.5,{angle:180,ease:Back.easeOut,onComplete:nextLose});
                aclock.setAnimationByName(0, "LOSE", true);
                lives--;
                heartsText.setText("x " + lives);
                function nextLose(){
                    sound.play("explosion");
                    manecilla1.alpha = 0;
                    manecilla2.alpha = 0;    
                    boton_manecillas.alpha = 0;
                    aclock.setAnimationByName(0, "LOSESTILL", true);
                    finishGame();
                }
                
            }
            
            answer = 0;
        }
        

        
        
        
        
        var textHour;
        if(hour <= 9){
            textHour = "0" + hour;
        }else{
            textHour = hour;
        }
        
        var textMinute;
        if(minute <= 9){
            textMinute = "0" + minute;
        }else{
            textMinute = minute;
        }
        
        var textDigital = game.add.text(0, 0,textHour + ":" + textMinute, styleDigital,sceneGroup);
        textDigital.anchor.setTo(0.5,0.5);
        textDigital.x = game.world.centerX;
        textDigital.y = dclock.y - textDigital.height/1.3;
        
        /*var textDebug = game.add.text(0,0,"angulo",styleDigital);
        textDebug.fontSize = "30px";
        textDebug.x = 0;
        textDebug.y = game.height - textDebug.height;*/
        
        var blockCollisionGroup = game.physics.p2.createCollisionGroup();
    
        manecilla1 = sceneGroup.create(0,0,"manecilla1");
        manecilla1.anchor.setTo(0.5,1);
        manecilla1.x = game.world.centerX;
        manecilla1.y = aclock.y + manecilla1.height/5;
        manecilla1.clock = 0;
        
		manecilla1.inputEnabled = true;
    	manecilla1.input.enableDrag(false);
		manecilla1.events.onDragStart.add(dragStart,this);
		manecilla1.events.onDragUpdate.add(dragUpdate,this);
        manecilla1.input.setDragLock(false, false);	
        
        manecilla2 = sceneGroup.create(0,0,"manecilla2");
        manecilla2.anchor.setTo(0.5,1);
        manecilla2.x = game.world.centerX;
        manecilla2.y = aclock.y + manecilla2.height/3.5;
        manecilla2.clock = 1;
		manecilla2.inputEnabled = true;
    	manecilla2.input.enableDrag(false);
		manecilla2.events.onDragStart.add(dragStart,this);
		manecilla2.events.onDragUpdate.add(dragUpdate,this);
        manecilla2.input.setDragLock(false, false);	        
        
    
        
        var boton_manecillas = sceneGroup.create(0,0,"boton_manecillas");
        boton_manecillas.anchor.setTo(0.5,0.5);
        boton_manecillas.x = game.world.centerX;
        boton_manecillas.y = aclock.y + boton_manecillas.height;        
        
        function dragStart(){
             
        }        
        
        function dragUpdate(object){
            sound.play("windingClock");
            targetAngle = (360 / (2 * Math.PI)) * game.math.angleBetween(
                  object.x, object.y,
                  this.game.input.activePointer.x, this.game.input.activePointer.y) + 90;

                if(targetAngle < 0)
                    targetAngle += 360;

                if(game.input.activePointer.isDown && !dragging)
                {
                    
                    dragging = true;
                    
                }
                if(!game.input.activePointer.isDown && dragging)
                {
                    
                    dragging = false;
                    
                    
                    
                }

                if(dragging)
                {
                    
                    object.angle = targetAngle;
                    if(object.clock == 1){
                        angleHour = Math.round(targetAngle);
                    }else{
                        angleMinute = Math.round(targetAngle);
                    }
                    changeBackground();
                  
                    //textDebug.setText("Hora:" + angleHour + "Minutos:" + angleMinute);
     
                }
        }
        
        
        function changeBackground(){
            
                    if(morningBackground){
                        if(angleHour >= 180 && angleHour <= 360){
                                dia.alpha = 0;
                                dia_swatch.alpha = 0;
                                noche.alpha = 0;
                                noche_swatch.alpha = 0;    
                                morning.alpha = 1;
                                morning_swatch.alpha = 1;
                           }else{
                                dia.alpha = 0;
                                dia_swatch.alpha = 0;
                                noche.alpha = 1;
                                noche_swatch.alpha = 1;    
                                morning.alpha = 0;
                                morning_swatch.alpha = 0;                              
                           }
                    }else{
                    if(angleHour >= 200 && angleHour <= 355){
                                dia.alpha = 0;
                                dia_swatch.alpha = 0;
                                noche.alpha = 1;
                                noche_swatch.alpha = 1;    
                                morning.alpha = 0;
                                morning_swatch.alpha = 0;
                           }else{
                                dia.alpha = 1;
                                dia_swatch.alpha = 1;
                                noche.alpha =0;
                                noche_swatch.alpha = 0;    
                                morning.alpha = 0;
                                morning_swatch.alpha = 0;                              
                           }
                    }
        }
        
        
        
        function newHour(){
            sound.play("magic");
            console.log("Antes: hora:" + hour + " minuto:" + minute);
            targetAngle = 0;
            angleHour = 0;
            angleMinute = 0;
                okButtonOn.inputEnabled = true;
                buttonOkGroup.alpha = 1;
            
                hour = getRandomArbitrary(0, 24);
                minute = getRandomArbitrary(0, 12)*5;
                
            
                if(hour <= 9){
                    textHour = "0" + hour;
                }else{
                    textHour = hour;
                }
                if(minute <= 9){
                    textMinute = "0" + minute;
                }else{
                    textMinute = minute;
                }
                textDigital.setText(textHour + ":" + textMinute);
                aclock.setAnimationByName(0, "IDLE", true);
                TweenMax.to(manecilla1,0.5,{angle:0,ease:Back.easeOut});
                TweenMax.to(manecilla2,0.5,{angle:0,ease:Back.easeOut});
                console.log("Nueva: hora:" + hour + " minuto:" + minute);
        }
        
        
        function finishGame(){

            TweenMax.to(game,2,{alpha:0,onComplete:gameOver});
            sound.play("wrong");
            sound.play("gameLose");
            bgm.stop();	
        }	
	
		
		function gameOver(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,NumwebGame)
			sceneloader.show("result");
		}        
        
        
		createCoins(coins);
		createHearts(lives);
		createOverlay();
		
       
        
	}
	
	function update() {
		morning_swatch.tilePosition.x += 1;
        noche_swatch.tilePosition.x += 1;
        dia_swatch.tilePosition.x += 1;
        
	}
		

	
	
	return {
		assets: assets,
		name: "clockfix",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()