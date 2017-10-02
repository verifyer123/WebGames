var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/wildDentist/";
var wildDentist = function(){

	assets = {
        atlases: [                
			{
                name:  "atlas.tutorial",
                json:  imagePath + "tutorial/atlas.json",
                image: imagePath + "tutorial/atlas.png",
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
    /*vars defautl*/
    var gameIndex = 0;
	var background;
	var sceneGroup = null;
	var heartsGroup = null;
	var speedGame = 5;
	var heartsIcon;
	var heartsText;	
	var xpIcon;
	var xpText;
	var lives = 3;
	var coins = 0;
	var bgm = null; 
    /*vars defautl*/
    var reviewComic = true;
	var style = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};

    function preload() {
		buttons.getImages(game);
        game.load.image("background", imagePath + "background.png");
        game.load.image("heartsIcon", imagePath + "hearts.png");
        game.load.image("xpIcon", imagePath + "xpcoins.png");
        game.load.image("gametuto", imagePath + "tutorial/tuto.png");
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
        overlayGroup = game.add.group();
            if(game.device != 'desktop'){
            overlayGroup.scale.setTo(1,1);
            }else{
                overlayGroup.scale.setTo(1.2,1.2);
            }
        sceneGroup.add(overlayGroup);
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
            })
            
        });
        overlayGroup.add(rect)
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,"atlas.tutorial","introscreen")
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5);
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,"gametuto")
		tuto.anchor.setTo(0.5,0.5);
       var action = 'tap'
        if(game.device == 'desktop'){
            action = 'click'
        };
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 225,"atlas.tutorial",'how' + localization.getLanguage())
		howTo.anchor.setTo(0.48,0.5);
		howTo.scale.setTo(0.7,0.7);
		var deviceName = 'pc'
		var offsetX = 0
            if(!game.device.desktop){
               deviceName = 'tablet'
                offsetX = 50
                var inputLogo = overlayGroup.create(game.world.centerX + offsetX,game.world.centerY + 145,'atlas.tutorial','movil');
                inputLogo.anchor.setTo(0.5,0.5);	 
            }else{
                var inputLogo = overlayGroup.create(game.world.centerX,game.world.centerY + 145,"atlas.tutorial",'pc');
                inputLogo.anchor.setTo(0.4,0.5);	
            };
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height,"atlas.tutorial",'button')
		button.anchor.setTo(0.4,0.5)
		var playText = overlayGroup.create(game.world.centerX, button.y,"atlas.tutorial",'play' + localization.getLanguage())
		playText.anchor.setTo(0.4,0.5)
    };	
	
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
	};	

	function SumeCoins(){
	
			dinamita.setAnimationByName(0, "WIN", true);
			dinamita.setSkinByName("win");		
				
	}
	function gameOver(){
		var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, coins,gameIndex)
			sceneloader.show("result");
	}    
    
	/*CREATE SCENE*/
    function createScene(){
		sceneGroup = game.add.group();
		loadSounds();
		//background = game.add.tileSprite(0,0,game.world.width, game.world.height, "background");
		//sceneGroup.add(background);
		createHearts();
		createCoins();
        //addParticles();
        if(!reviewComic){
            createComic(4);
        }else{
          createOverlay();  
        }
        
	}

	function update() {
		if(starGame){	
			if(lives != 0){	
				//if (cursors.left.isUp){};
			}
		}
	}
    
    
	return {
		assets: assets,
		name: "wildDentist",
		preload: preload,
		create: createScene,
		update:update,
		show: function(event){
			initialize()
		}		
	}
}()