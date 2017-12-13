var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/wildDentist/";
var wildDentist = function(){

	assets = {
        atlases: [                
			{
                name:  "atlas.tutorial",
                json:  imagePath + "tutorial/atlas.json",
                image: imagePath + "tutorial/atlas.png",
			},                
			{
                name:  "atlas.game",
                json:  imagePath + "atlas.json",
                image: imagePath + "atlas.png",
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
				file: soundsPath + "combo.mp3"},
			{	name: "combo",
				file: soundsPath + "combo.mp3"},
			{	name: "bite",
				file: soundsPath + "bite.mp3"}
		],
	}
    /*vars defautl*/
    var gameIndex = 95;
	var background;
	var sceneGroup = null;
	var heartsGroup = null;
	var speedGame = 2;
    var speed = 3;
	var heartsIcon;
	var heartsText;	
	var xpIcon;
	var xpText;
	var lives = 3;
	var coins = 0;
	var bgm = null; 
    var particlesGroup;
    var usedParticles;
    var reviewComic = true;
    var style = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
    /*vars defautl*/
        var castores = [
            {id:0,idle:"",bite:"",bad_breath:"",broken:"",caries:"",hit:"",clean:true,state:"",biteBeaver:false},{id:1,idle:"",bite:"",bad_breath:"",broken:"",caries:"",hit:"",clean:true,state:"",biteBeaver:false},{id:2,idle:"",bite:"",bad_breath:"",broken:"",caries:"",hit:"",clean:true,state:"",biteBeaver:false}
        ];
        var arrayTrunks = [
            {tronco1:"",tronco2:"",tronco3:""},
            {tronco1:"",tronco2:"",tronco3:""},
            {tronco1:"",tronco2:"",tronco3:""}
        ];
        var buttonsOptions = [];
        var hitZones = [];
        var ondasCastores = new Array;
        var tileRocks = new Array;
          
	

    function preload() {
		buttons.getImages(game);
        game.load.audio('wormwood',  soundsPath + 'songs/wormwood.mp3');
        game.load.image("background", imagePath + "background.png");
        game.load.image("heartsIcon", imagePath + "hearts.png");
        game.load.image("xpIcon", imagePath + "xpcoins.png");
        game.load.image("gametuto", imagePath + "tutorial/tuto.png");
        game.load.image("click", imagePath + "tutorial/click.png");
        game.load.image("ondasAgua", imagePath + "ondas_agua.png");
        game.load.image("rocks", imagePath + "tile_rocks.png");
        game.load.image("star", imagePath + "star.png");
        game.load.image("wrong", imagePath + "wrong.png");
        game.load.spritesheet('bad_breath', imagePath + 'sprites/bad_breath/sprite.png', 415, 271, 24);
        game.load.spritesheet('bite', imagePath + 'sprites/bite/sprite.png', 292, 268, 19);
        game.load.spritesheet('broken', imagePath + 'sprites/broken/sprite.png', 249, 238, 23);
        game.load.spritesheet('caries', imagePath + 'sprites/caries/sprite.png', 249, 238, 23);
        game.load.spritesheet('idle', imagePath + 'sprites/idle/sprite.png', 249, 238, 24);
        game.load.spritesheet('hit', imagePath + 'sprites/hit/sprite.png', 338, 268, 14);
    }

	function loadSounds(){
		sound.decode(assets.sounds);
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
           particle.x = obj.world.x + offX + obj.width/2;
            particle.y = obj.world.y + obj.height/2;
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
		speed = 2;
		starGame = false;
                for(var p = 0; p<=2;p++){
                    castores[p].biteBeaver = false;
                    castores[p].clean = true;
                    castores[p].state = "";
                }        
        sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
        
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
		
		bgm = game.add.audio('wormwood');
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
                var inputLogo = overlayGroup.create(game.world.centerX + offsetX/2,game.world.centerY + 145,'click');
                inputLogo.anchor.setTo(0.5,0.5);	 
            }else{
                var inputLogo = overlayGroup.create(game.world.centerX + 10,game.world.centerY + 130,'click');
                inputLogo.anchor.setTo(0.4,0.5);	
            };
		var button = overlayGroup.create(game.world.centerX, plane.y + plane.height/2,"atlas.tutorial",'button')
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
            bgm.stop();
            sound.play("gameLose");
	}    
    
	/*CREATE SCENE*/
    function createScene(){
		sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel);
		loadSounds();
		background = game.add.tileSprite(0,0,game.world.width, 216,"atlas.game", "tile_sky");
		sceneGroup.add(background);
        var groupTrunks = game.add.group();   
        
        var seaBg = new Phaser.Graphics(game)
        seaBg.beginFill(0x45B4AF)
        seaBg.drawRect(0,160,game.world.width, game.world.height);
        seaBg.endFill();
        sceneGroup.add(seaBg); 
        sceneGroup.add(groupTrunks);
        for(var i=0;i<=2;i++){
                
                castores[i].idle = game.add.sprite(50, 0, 'idle');
                var castorAnima = castores[i].idle.animations.add('castorAnima');
                castores[i].idle.animations.play('castorAnima', 24, true);
                castores[i].idle.anchor.setTo(0.1,0); 
                castores[i].idle.y = 20 + castores[i].idle.height * i;
                //castores[i].idle.alpha = 0;
                sceneGroup.add(castores[i].idle);  
            
                castores[i].hit = game.add.sprite(-30, 0, 'hit');
                var castorAnimahit = castores[i].hit.animations.add('castorAnimahit');
                castores[i].hit.animations.play('castorAnimahit', 24, true);
                castores[i].hit.anchor.setTo(0.1,0); 
                castores[i].hit.y = castores[i].idle.height * i - 10;
                castores[i].hit.alpha = 0;
                sceneGroup.add(castores[i].hit);            
                
                castores[i].bite = game.add.sprite(30, 0, 'bite');
                var castorAnima2 = castores[i].bite.animations.add('castorAnima2');
                castores[i].bite.animations.play('castorAnima2', 24, true);
                castores[i].bite.anchor.setTo(0.1,0); 
                castores[i].bite.y = -10 + castores[i].idle.height * i;
                castores[i].bite.alpha = 0;
                sceneGroup.add(castores[i].bite);
            
                castores[i].bad_breath = game.add.sprite(55, 0, 'bad_breath');
                var castorAnima3 = castores[i].bad_breath.animations.add('castorAnima3');
                castores[i].bad_breath.animations.play('castorAnima3', 24, true);
                castores[i].bad_breath.anchor.setTo(0.1,0); 
                castores[i].bad_breath.y = 0 + castores[i].idle.height * i;
                castores[i].bad_breath.alpha = 0;
                sceneGroup.add(castores[i].bad_breath);

                castores[i].broken = game.add.sprite(55, 0, 'broken');
                var castorAnima4 = castores[i].broken.animations.add('castorAnima4');
                castores[i].broken.animations.play('castorAnima4', 24, true);
                castores[i].broken.anchor.setTo(0.1,0); 
                castores[i].broken.y = 30 + castores[i].idle.height * i;
                castores[i].broken.alpha = 0;
                sceneGroup.add(castores[i].broken);  

                castores[i].caries = game.add.sprite(55, 0, 'caries');
                var castorAnima5 = castores[i].caries.animations.add('castorAnima5');
                castores[i].caries.animations.play('castorAnima5', 24, true);
                castores[i].caries.anchor.setTo(0.1,0); 
                castores[i].caries.y = 30 + castores[i].caries.height * i;
                castores[i].caries.alpha = 0;
                sceneGroup.add(castores[i].caries);            
            
                ondasCastores[i] = sceneGroup.create(0,castores[i].idle.y,"ondasAgua");
                ondasCastores[i].x = ondasCastores[i].x + ondasCastores[i].width/2 - 20;
                ondasCastores[i].y = ondasCastores[i].y + castores[i].idle.height/1.5;
                ondasCastores[i].scale.setTo(0.7);
                ondasCastores[i].anchor.setTo(0.5,0);
                TweenMax.fromTo(ondasCastores[i].scale,1,{x:0.7},{x:0.8,repeat:-1,yoyo:true});
                arrayTrunks[i].tronco1 = groupTrunks.create(0,0,"atlas.game","tronco1");
                arrayTrunks[i].tronco1.x = game.width - 300;
                arrayTrunks[i].tronco1.y = castores[i].idle.y + arrayTrunks[i].tronco1.height + 20;        
                arrayTrunks[i].tronco2 = groupTrunks.create(0,0,"atlas.game","tronco2");
                arrayTrunks[i].tronco2.x = arrayTrunks[i].tronco1.x;
                arrayTrunks[i].tronco2.y = castores[i].idle.y + arrayTrunks[i].tronco2.height + 35; 
                arrayTrunks[i].tronco2.alpha = 0;
                arrayTrunks[i].tronco3 = groupTrunks.create(0,0,"atlas.game","tronco3");
                arrayTrunks[i].tronco3.x = arrayTrunks[i].tronco1.x - 20;
                arrayTrunks[i].tronco3.y = castores[i].idle.y + arrayTrunks[i].tronco3.height + 40;
                arrayTrunks[i].tronco3.alpha = 0;             
                tileRocks[i] = game.add.tileSprite(0,0,game.width,155,"rocks");
                tileRocks[i].height = 155;
                tileRocks[i].y = arrayTrunks[i].tronco1.y + tileRocks[i].height/2;
                sceneGroup.add(tileRocks[i]);
            
                hitZones[i] = new Phaser.Graphics(game)
                hitZones[i].beginFill(0x0aff55)
                hitZones[i].drawRect(castores[i].idle.x + 50,castores[i].idle.y + 100,castores[i].idle.width/2, castores[i].idle.height/4);
                hitZones[i].alpha = 0;
                hitZones[i].id = 4;
                hitZones[i].endFill(); 
                sceneGroup.add(hitZones[i]);            
            
        }
        
        var container = sceneGroup.create(0,0,"atlas.game","contenedor");
        container.y = game.height - container.height + 10;
        container.width = game.width;
        
        buttonsOptions[0] = sceneGroup.create(0,0,"atlas.game","brush");
        buttonsOptions[0].id = 0;
        buttonsOptions[0].y = game.height - buttonsOptions[0].height/2 - 10;    
        buttonsOptions[0].x = buttonsOptions[0].width;
        buttonsOptions[0].posx = buttonsOptions[0].x;
        buttonsOptions[0].posy = buttonsOptions[0].y;
        buttonsOptions[0].inputEnabled = true;
        buttonsOptions[0].anchor.setTo(0.5,0.5);
        buttonsOptions[0].input.enableDrag();
        buttonsOptions[0].events.onDragStart.add(onDragStart, this);
        buttonsOptions[0].events.onDragStop.add(onDragStop, this);
        
        buttonsOptions[1] = sceneGroup.create(0,0,"atlas.game","floss");
        buttonsOptions[1].id = 1;
        buttonsOptions[1].y = game.height - buttonsOptions[1].height/2 - 10;    
        buttonsOptions[1].x = game.world.centerX + 20;
        buttonsOptions[1].anchor.setTo(0.5,0.5);
        buttonsOptions[1].posx = buttonsOptions[1].x;
        buttonsOptions[1].posy = buttonsOptions[1].y;
        buttonsOptions[1].inputEnabled = true;
        buttonsOptions[1].anchor.setTo(0.5,0.5);  
        buttonsOptions[1].input.enableDrag();
        buttonsOptions[1].events.onDragStart.add(onDragStart, this);
        buttonsOptions[1].events.onDragStop.add(onDragStop, this);      
        
        buttonsOptions[2] = sceneGroup.create(0,0,"atlas.game","enjuague");
        buttonsOptions[2].id = 2;
        buttonsOptions[2].y = game.height - buttonsOptions[2].height/2 - 10;   
        buttonsOptions[2].x = game.width - buttonsOptions[2].width;
        buttonsOptions[2].anchor.setTo(0.5,0.5);
        buttonsOptions[2].anchor.setTo(0.5,0.5);
        buttonsOptions[2].posx = buttonsOptions[2].x;
        buttonsOptions[2].posy = buttonsOptions[2].y;
        buttonsOptions[2].inputEnabled = true;
        buttonsOptions[2].anchor.setTo(0.5,0.5);  
        buttonsOptions[2].input.enableDrag();
        buttonsOptions[2].events.onDragStart.add(onDragStart, this);
        buttonsOptions[2].events.onDragStop.add(onDragStop, this);          
 		createHearts();
		createCoins();
        addParticles();
        createOverlay();
       /* if(!reviewComic){
            createComic(4);
        }else{
          //createOverlay(); 
            starGame = true;
        }*/
        
	}
    
       function onDragStart(sprite, pointer) {
            console.log("sprite: " + sprite.id);
            console.log("hit zone: " + hitZones[0].id);  
           console.log("hit zone: " + hitZones[1].id);  
           console.log("hit zone: " + hitZones[2].id);  
        }
        
        function onDragStop(sprite, pointer) {
            
            for(var d = 0;d<=2;d++){
                
                if(hitZones[d].id == sprite.id){
                    if(castores[d].clean == false){
                    if (checkOverlap(hitZones[d], sprite) ){
                                castores[d].broken.alpha = 0;
                                castores[d].bad_breath.alpha = 0; 
                                castores[d].caries.alpha = 0;
                                castores[d].idle.alpha = 1;
                                castores[d].biteBeaver = false;
                                castores[d].clean = true;
                                speed = speed + 0.05;
                                sound.play("magic");
                                createPart('star',castores[d].idle);
                                hitZones[d].id = 4;
                                coins++;
                                xpText.setText(coins);   
                        }
                    }
                }else{
                    if (checkOverlap(hitZones[d], sprite) ){
                        createPart('wrong',sprite);
                        sound.play("wrong");
                        lives--;
                        heartsText.setText(lives);
                    }
                }
            
            }
            sprite.scale.setTo(0);
            sprite.x = sprite.posx;
            sprite.y = sprite.posy;
            game.add.tween(sprite.scale).to({x:1,y:1},300,Phaser.Easing.linear,true);
   
        }
        
        function checkOverlap(spriteA, spriteB) {

            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();

            return Phaser.Rectangle.intersects(boundsA, boundsB);

        }       
    
    
        function moveTrunk(trunk,speed,target){
            if(!target.biteBeaver){
                if(trunk.tronco1.x > (target.idle.x + target.idle.width/1.5)){
                        trunk.tronco1.x -= speed;
                        trunk.tronco2.x = trunk.tronco1.x;
                        trunk.tronco3.x = trunk.tronco1.x
                        trunk.tronco1.alpha = 1;   
                    
                }else{
                    
                     if(target.clean){
                        target.idle.alpha = 0;
                        target.bite.alpha = 1;
                        target.biteBeaver = true;
                        updateBeaver(trunk,speed,target);
                     }else{
                        target.clean = true;
                        target.state.alpha = 0;
                        target.hit.alpha = 1;
                        target.biteBeaver = true;
                        hitBeaver(trunk,target);
                    }

                }
            }
        }    
    
    function hitBeaver(trunk,target){
        game.add.tween(trunk.tronco1).to({alpha:0},500,"Linear",true,0).onComplete.add(function(){
                            console.log("mal");
                            target.clean = false;
                            target.state.alpha = 1; 
                            trunk.tronco1.x = game.width + 100;
                            trunk.tronco1.alpha = 1;
                            target.hit.alpha = 0;
                            target.biteBeaver = false;
                            createPart('wrong',target.hit);
                            sound.play("wrong");
                            
                            if(lives != 0){	
                               lives--; 
                            }else{
                                starGame = false;
                                gameOver();
                            }
                            heartsText.setText(lives);
                         });
    }
      
    
    
    function updateBeaver(trunk,speed,target){
        var counter = 1;
        var anim = target.bite.animations.add('castorAnima2');
        anim.onLoop.add(eatTrunk, this);
        anim.play(speed * 12, true);
        
        function eatTrunk(){
            if(counter == 1){
                trunk.tronco1.alpha = 0;
                trunk.tronco2.alpha = 1; 
                sound.play("bite");
                 counter++;
            }else if(counter == 2){
               trunk.tronco2.alpha = 0;
               trunk.tronco3.alpha = 1; 
                sound.play("bite");
                 counter++;
            }else if(counter == 3){ 
                trunk.tronco3.alpha = 0;
                counter = 0;
                target.bite.alpha = 0;
                sound.play("bite");
                trunk.tronco1.alpha = 1;
                trunk.tronco1.x = game.width + 100;
                target.biteBeaver = false;
                
                switch(getRandomArbitrary(0,3)){
                    case 0:
                        target.clean = false;
                        target.caries.alpha = 1;
                        hitZones[target.id].id = 0; 
                        target.state = target.caries;
                    break;
                    case 1:
                        target.clean = false;
                        target.broken.alpha = 1;  
                        hitZones[target.id].id = 1;  
                        target.state = target.broken;  
                    break;
                    case 2:
                        target.clean = false;
                        target.bad_breath.alpha = 1;
                        hitZones[target.id].id = 2; 
                        target.state = target.bad_breath;
                         
                    break;
                       }
            }
           
        }
        
    }
    
    
	function update() {
        

       
        
		if(starGame){	
			if(lives != 0){	
				for(var p = 0; p<=2;p++){
                    moveTrunk(arrayTrunks[p],speed,castores[p])
                }
			}else{
                starGame = false;
                gameOver();
                for(var p = 0; p<=2;p++){
                    castores[p].biteBeaver = false;
                    castores[p].clean = true;
                    castores[p].state = "";
                }
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