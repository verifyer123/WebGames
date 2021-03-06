
var soundsPath = "../../shared/minigames/sounds/"
var drumsAndFroots = function(){
    
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
                name: "atlas.drumsAndFroots",
                json: "images/drumsAndFroots/atlas.json",
                image: "images/drumsAndFroots/atlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/drumsAndFroots/gametuto.png",
            },
            {   name:'light',
				file:"images/drumsAndFroots/light.png"
            },
            {   name:'lightblue',
				file:"images/drumsAndFroots/lightblue.png"
			}
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "cheers",
				file: soundsPath + "cheers.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'beatSong',
                file: soundsPath + 'songs/retrowave.mp3'},
            {	name: "sound0",
				file: "localSounds/sound0.wav"},
            {	name: "sound1",
				file: "localSounds/sound1.wav"},
            {	name: "sound2",
				file: "localSounds/sound2.wav"},
            {	name: "sound3",
				file: "localSounds/sound3.wav"},
            {	name: "sound4",
				file: "localSounds/sound4.wav"},
            {	name: "sound5",
				file: "localSounds/sound5.mp3"},
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coin.png",
                width: 122,
                height: 123,
                frames: 12
            }
        ],
        spines:[
			{
				name:"beat",
				file:"images/spines/beat/speaker.json",
            },
            {
                name:"sam",
				file:"images/spines/sam/sam.json"
            },
            {
                name:"background",
				file:"images/spines/background/background.json"
            },
            {
                name:"people",
				file:"images/spines/people/people.json"
			}
		]
    }
     
    var lives = null;
    var sceneGroup = null;
    var gameIndex = 190;
    var heartsGroup = null;
    var pointsBar;
    var coin;
    var particleCorrect;
	var particleWrong;

    var gameActive;
    var beatSong;
    var sam;
    var meter, pump;
    var speakersGroup;
    var speakersAnimGroup;
    var speakercolors = [ 'white', 'yellow' , 'red','orange', 'green' , 'blue'];
    var rnd;
    var lvl;
    var pivot;
    var secuence;
    var speakerNumber;
    var publicTweens;
    var handsGroup;
    var pasTutorial;
    var glitGroup;
    var win;
    var pivotLigth;
    var glitter = ['glitter1', 'glitter2', 'glitter3', 'glitter4'];
    var clapBar;
    var appearHand;
    var background;
    var public;
    
	function loadSounds(){
		sound.decode(assets.sounds);
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff";
        lives = 3;
        gameActive = false;
        rnd = -1;
        lvl = 4;
        pivot = 0;
        speakerNumber = 6;
        secuence = [];
        publicTweens = [];
        pasTutorial = false;
        pivotLigth = 0;
        win = true;
        appearHand = false;
        loadSounds();
    }
    
    function preload(){
        game.stage.disableVisibilityChange = false;
        game.load.image('introscreen',"images/drumsAndFroots/introscreen.png")
		game.load.image('howTo',"images/drumsAndFroots/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/drumsAndFroots/play" + localization.getLanguage() + ".png")
    }

    function stopGame(win){
        
		sound.play("gameLose");
        gameActive = false;
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300);
		tweenScene.onComplete.add(function(){
            beatSong.stop();
			var resultScreen = sceneloader.getScene("result");
			resultScreen.setScore(true, pointsBar.number,gameIndex,KELLOGS_ENUM.SAM,1.4);			
            sceneloader.show("result");
		});
    }

    function update(){
        
    }

    function createPointsBar(){
        
        pointsBar = game.add.group();
        pointsBar.x = game.world.width;
        pointsBar.y = 0;
        sceneGroup.add(pointsBar);
        
        var pointsImg = pointsBar.create(-10,10,'atlas.drumsAndFroots','xpcoins');
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
        
        sound.play("magic");
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number);
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true);
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true);
        })
        
        addNumberPart(pointsBar.text,'+' + number);	
        
    }

    function addCoin(){
        
        coin.x = game.world.centerX;
        coin.y = game.world.centerY;
        time = 300;

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true);
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
            game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
                game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                    addPoint(1)
                    if(pointsBar.number !== 0 && pointsBar.number % 4 === 0){
                        lvl++
                    }
                    if(speakerNumber < 5 && pointsBar.number !== 0 && pointsBar.number % 2 === 0){
                        speakerNumber += 2
                    }
                });
            });
        });
    }

    function initCoin(){
        coin = game.add.sprite(0, 0, "coin");
        coin.anchor.setTo(0.5);
        //coin.scale.setTo(0.5)
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
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500);
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

        var heartImg = group.create(0,0,'atlas.drumsAndFroots','life_box');

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
        
        /*if(lives == 0){
            stopGame(false)
        }*/
        
        addNumberPart(heartsGroup.text,'-1');
        
    }

    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.drumsAndFroots',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = 0.8;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In);
        return particle
    }

    function createParticles(){
    	particleCorrect = createPart("star");
        sceneGroup.add(particleCorrect);

        particleWrong = createPart("smoke");
        sceneGroup.add(particleWrong);
    }
	 
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 

	function createBackground(){
        
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.drumsAndFroots', "background"));

        background = game.add.spine(game.world.centerX, game.world.centerY - 140, "background");
        background.setAnimationByName(0, "idle", true);
        background.setSkinByName("normal");
        sceneGroup.add(background);

        var cam = sceneGroup.create(game.world.centerX, -30,  'atlas.drumsAndFroots', "camera");
        cam.scale.setTo(1.2,1.2);
        cam.anchor.setTo(0.5, 0);
        
        var light = sceneGroup.create(game.world.width, -100, "light");
        light.scale.setTo(1,2);
        light.anchor.setTo(1, 0);
        light.angle = 45;
        game.add.tween(light).to({angle:-45}, 2000, Phaser.Easing.linear, true, 0, -1).yoyo(true,0);

        var lightblue = sceneGroup.create(0, -100, "lightblue");
        lightblue.scale.setTo(1,2);
        lightblue.anchor.setTo(0, 0);
        lightblue.angle = -45;
        game.add.tween(lightblue).to({angle:45}, 2000, Phaser.Easing.linear, true, 0, -1).yoyo(true,0);
    }
    
    function scenario(){
        sam = game.add.spine(game.world.centerX, game.world.centerY + 350, "sam");
        sam.setAnimationByName(0, "idle", true);
        sam.setSkinByName("normal");
        sam.scale.setTo(1.3, 1.3);
        sceneGroup.add(sam);
        
        for(var c = 0; c < 2; c++){
            
            var console = sceneGroup.create(game.world.centerX, game.world.centerY + 140, 'atlas.drumsAndFroots', 'console' + c)
            console.anchor.setTo(c, 0)
            
            var shadow = sceneGroup.create(game.world.centerX, game.world.centerY + 140, 'atlas.drumsAndFroots', 'light' + c)
            shadow.anchor.setTo(c, 0.1)
        }

        public = game.add.spine(game.world.centerX, game.world.height + 50, "people");
        public.setAnimationByName(0, "idle", true);
        public.setSkinByName("normal");
        sceneGroup.add(public);
    }
    
    function clapMeter(){
        clapBar = game.add.sprite(game.world.centerX, game.world.height - 120, 'atlas.drumsAndFroots', 'bar');
        clapBar.anchor.setTo(0.5);
        sceneGroup.add(clapBar);
        
        meter = game.add.sprite(0, 0, 'atlas.drumsAndFroots', 'meter');
        meter.anchor.setTo(0 ,0.5);
        meter.x -= meter.width * 0.35;
        meter.scale.setTo(0, 1);
        clapBar.addChild(meter);
        clapBar.alpha = 0;
    }
    
    function theSonidero(){
        
        speakersGroup = game.add.group();
        speakersGroup.alpha = 0;
        sceneGroup.add(speakersGroup);
        
        speakersAnimGroup = game.add.group();
        sceneGroup.add(speakersAnimGroup);
        
        var space = 0
        var pivotS = 2
        
        for(var s = 0; s < 6; s++){
            
            if(s === pivotS){
                pivotS += 2
                space ++
            }
            
            var speakerAnim = game.add.spine(100, 150, "beat")
            speakerAnim.setAnimationByName(0, "idle", true)
            speakerAnim.setSkinByName(speakercolors[s])
            speakersAnimGroup.add(speakerAnim)
            
            var speaker = speakersGroup.create(-7, 70 + (150 * space), 'atlas.drumsAndFroots', 'speaker' + s)
            speaker.events.onInputDown.add(click ,this)
            speaker.number = s
            speaker.active = false
            
            if(s % 2 === 0){
                speaker.anchor.setTo(0, 0)
                speakerAnim.y += 155 * space
            }
            else{
                speaker.anchor.setTo(1, 0)
                speaker.x = game.world.width + 20
                speakerAnim.x = game.world.width - 100
                speakerAnim.y += 148 * space
            }
        }
        
        speakerAnim.y += 20
    }
    
    function click(obj){
        
        if(!pasTutorial){
            checkTutorial(obj)
        }
        else{
            beatIt(obj)
        }
    }
    
    function beatIt(obj){
        
        if(gameActive && pivot < lvl && obj.active){

            if(secuence[pivot] === obj.number){
                
                sam.setAnimationByName(0, "good", true)
                
                sound.play('sound' + obj.number)
                game.time.events.add(1000,function(){
                    sound.stop('sound' + obj.number)
                },this)
               
                speakersAnimGroup.children[obj.number].setAnimationByName(0, "play", true);
                speakersAnimGroup.children[obj.number].addAnimationByName(0, "idle", true);
                particleCorrect.x = speakersAnimGroup.children[obj.number].x 
                particleCorrect.y = speakersAnimGroup.children[obj.number].y 
                particleCorrect.start(true, 1000, null, 8)  
                pumItUp()
                pivot++
                
                if(pivot === lvl)
                    youRock(true)
            }
            else{
                sam.setAnimationByName(0, "wrong", true);
                sam.addAnimationByName(0, "lose", true);
                particleWrong.x = speakersAnimGroup.children[obj.number].x;
                particleWrong.y = speakersAnimGroup.children[obj.number].y;
                particleWrong.start(true, 1000, null, 8);
                win = false;
                youRock(false);
            }
        }
    }
    
    function pumItUp(){
        
        pump += 1/lvl
        game.add.tween(meter.scale).to({x:pump}, 300, Phaser.Easing.linear, true)
       
    }
    
    function youRock(ans){
        
        gameActive = false;
        activateButtons(speakersGroup.length,false);
        
        if(ans){
            
            playAll('play', true);
            background.setAnimationByName(0, "play", true);
            public.setAnimationByName(0, "play", true);
            beatSong.volume = 0;
            game.time.events.add(200,function(){
                beatSong.volume = 0.6;
                sound.play('cheers');
            },this)
            addCoin();
        }
        else{
            missPoint();
            beatSong.volume = 0;
        }
        game.time.events.add(300,function(){
            game.add.tween(clapBar).to({alpha : 0}, 300, Phaser.Easing.linear, true);
        },this);
        game.time.events.add(4000,function(){
            if(lives !== 0){
                initGame();
            }
            else{
                playAll('idle', false);
                background.setAnimationByName(0, "idle", true);
                public.setAnimationByName(0, "idle", true);
                beatSong.stop();
                for(var p = 0; p < publicTweens.length; p++){
                    publicTweens[p].stop();
                }
                game.time.events.add(1000,function(){
                    stopGame(false);
                },this)
            }
        },this)
    }
    
    function playAll(anim, loop){
        
        for(var n = 0; n < speakersAnimGroup.length; n++){
            speakersAnimGroup.children[n].setAnimationByName(0, anim, loop)
        }
    }
    
    function initGame(){
        
        pivot = 0;
        pump = 0;
        showMustGoOn();
        
        playAll('idle', true);
        background.setAnimationByName(0, "idle", true);
        public.setAnimationByName(0, "idle", true);
        sam.setAnimationByName(0, "idle", true);
        game.add.tween(meter.scale).to({x:pump}, 300, Phaser.Easing.linear, true);

        game.time.events.add(500,function(){
            var time = cue();
            game.time.events.add(time,function(){
                gameActive = true;
                game.add.tween(clapBar).to({alpha : 1}, 300, Phaser.Easing.linear, true).onComplete.add(function(){
                    activateButtons(speakerNumber,true);
                });
                if(!win){
                    win = true;
                    theShining();
                }
            },this);
        },this);
    }
	
    function showMustGoOn(){
        
        for(var s = 0; s < speakerNumber; s++){
            speakersAnimGroup.children[s].alpha = 1;
            speakersGroup.children[s].active = true;
        }
        
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, speakerNumber-1)
        if(x === rnd)
            return getRand()
        else
            return x     
    }
    
    function cue(){
        
        var delay = 500;
        beatSong.volume = 0.1;
        
        for(var i = 0; i < lvl; i++){
            
            rnd = getRand();
            secuence[i] = rnd;
            beatBox(delay, rnd);
            delay += 1000;
        }
        return delay
    }
    
    function beatBox(delay, num){
        
        game.time.events.add(delay,function(){
            sound.play('sound' + num)
            speakersAnimGroup.children[num].setAnimationByName(0, "play", true)
            particleCorrect.x = speakersAnimGroup.children[num].x 
            particleCorrect.y = speakersAnimGroup.children[num].y 
            particleCorrect.start(true, 1000, null, 8)  
            game.time.events.add(1000,function(){
                speakersAnimGroup.children[num].setAnimationByName(0, "idle", true)
                sound.stop('sound' + num)
            },this)
        },this)
    }
    
    function initTutorial(){
        
        pivot = 0;
        pump = 0;

        game.time.events.add(500,function(){
            var time = cue();
            game.time.events.add(time,function(){
                gameActive = true;
                game.add.tween(clapBar).to({alpha : 1}, 300, Phaser.Easing.linear, true).onComplete.add(function(){
                    activateButtons(speakerNumber,true);
                });
                if(!win){
                    win = true;
                    theShining();
                }
                handsGroup.alpha = 1;
                handPos();
            },this)
        },this)
    }

    function activateButtons(total,value){
        for(var b = 0; b < total; b++){
            speakersGroup.children[b].inputEnabled = value;
        }
    }
    
    function handPos(){
        if(!appearHand){
            appearHand = true;
            handsGroup.setAll('x', speakersGroup.children[secuence[pivot]].centerX);
            handsGroup.setAll('y', speakersGroup.children[secuence[pivot]].centerY);
        }else{
            for(var h=0; h<handsGroup.length; h++){
                game.add.tween(handsGroup.children[h]).to({x: speakersGroup.children[secuence[pivot]].centerX, y:speakersGroup.children[secuence[pivot]].centerY}, 300, Phaser.Easing.linear, true);
            }
        }
        
        speakersGroup.setAll('active', false)
        speakersGroup.children[secuence[pivot]].active = true
        
    }
    
    function checkTutorial(obj){
        
        if(gameActive && pivot < lvl && obj.active){
   
            sam.setAnimationByName(0, "good", true);

            sound.play('sound' + obj.number)
            game.time.events.add(1000,function(){
                sound.stop('sound' + obj.number)
            },this)
            
            speakersAnimGroup.children[obj.number].setAnimationByName(0, "play", true)
            speakersAnimGroup.children[obj.number].addAnimationByName(0, "idle", true)
            particleCorrect.x = speakersAnimGroup.children[obj.number].x 
            particleCorrect.y = speakersAnimGroup.children[obj.number].y 
            particleCorrect.start(true, 1000, null, 8)  
            pumItUp()
            pivot++

            if(pivot === lvl){
                activateButtons(speakerNumber,false);
                endTutorial();
            }
            else{
                 handPos();
            }
                
        }
    }
    
    function endTutorial(){
        
        lvl = 3
        speakerNumber = 2
        pasTutorial = true
        handsGroup.destroy()
        
        playAll('play', true);
        background.setAnimationByName(0, "play", true);
        public.setAnimationByName(0, "play", true);
        beatSong.volume = 0
        game.time.events.add(200,function(){
            beatSong.volume = 0.6;
            sound.play('cheers');
        },this);
        game.time.events.add(500,function(){
            game.add.tween(clapBar).to({alpha : 0}, 300, Phaser.Easing.linear, true);
        },this);
        game.time.events.add(4000,function(){
            speakersAnimGroup.setAll('alpha', 0);
            speakersGroup.setAll('active', false);
            showMustGoOn();
            initGame();
        },this)
    }
    
    function initHand(){
        
        handsGroup = game.add.group();
        handsGroup.alpha = 0;
        sceneGroup.add(handsGroup);
        
        var handUp = handsGroup.create(0, 0, 'atlas.drumsAndFroots', 'handUp') // 0
        handUp.anchor.setTo(0.2);
        
        var handDown = handsGroup.create(0, 0, 'atlas.drumsAndFroots', 'handDown') // 1
        handDown.anchor.setTo(0.2);
        
        handsGroup.tween = game.add.tween(handsGroup).to({y:handsGroup.y + 10}, 400, Phaser.Easing.linear, true)
            
        handsGroup.tween.onComplete.add(function() 
        {
            changeImage(0, handsGroup);
            game.add.tween(handsGroup).to({y:handsGroup.y - 10}, 400, Phaser.Easing.linear, true).onComplete.add(function(){
                handsGroup.tween.start();
                changeImage(1, handsGroup);
            });
        });
    }

    function lightsOn(){
           
        glitGroup = game.add.group();
        sceneGroup.add(glitGroup);
        
        for(var l = 0; l < 25; l ++){
            var glit = game.add.sprite(0, 0, "atlas.drumsAndFroots", glitter[game.rnd.integerInRange(0, 3)]);
            glit.scale.setTo(0.7,0.7);
            glit.alpha = 0;
            glitGroup.add(glit);
        }
        
        theShining();
    }
    
    function theShining(){
        
        glitGroup.children[pivotLigth].alpha = 1;
        glitGroup.children[pivotLigth].x = game.world.randomX;
        glitGroup.children[pivotLigth].y = game.world.randomY;
    
        game.time.events.add(150,function(){
            game.add.tween(glitGroup.children[pivotLigth]).to({ alpha: 0 }, 1000, Phaser.Easing.linear, true);
            
            if(pivotLigth < 19){
                pivotLigth++;
            }
            else{
                pivotLigth = 0;
            }
               
            if(win){
                theShining();
            }
        }, this);
    }

    function createOverlay(){
        
        overlayGroup = game.add.group()
        sceneGroup.add(overlayGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("pop")
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                // onClickPlay
				overlayGroup.y = -game.world.height
				initTutorial();
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
        var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,"tutorial_image");
        tuto.scale.setTo(0.8,0.8);
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.drumsAndFroots',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.drumsAndFroots','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
	return {
		
		assets: assets,
		name: "drumsAndFroots",
		//update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames();
			return games[gameIndex];
		},
		create: function(event){
            
			sceneGroup = game.add.group();
		          			
            beatSong = game.add.audio('beatSong')
            game.sound.setDecodedCallback(beatSong, function(){
                beatSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true;
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false;
            }, this);
            
            initialize();
            createBackground();
            lightsOn();
            theSonidero();
            scenario();
            clapMeter();
            initHand();
            
            createHearts();
			createPointsBar();
            initCoin();
            createParticles();
			
            buttons.getButton(beatSong,sceneGroup);
            
            createOverlay();
		}
	}
}()