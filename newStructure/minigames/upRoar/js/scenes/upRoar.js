
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var upRoar = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
			"tutorial_image":"images/upRoar/tutorial_image_EN.png",
			"duck":"duck",
			"duckAction":"quacks",
			"parrot":"parrot",
			"parrotAction":"garrings",
			"cow":"cow",
			"cowAction":"moos",
			"dog":"dog",
			"dogAction":"barks",
			"frog":"frog",
			"frogAction":"croaks",
			"horse":"horse",
			"horseAction":"neighs",
			"lion":"lion",
			"lionAction":"roars",
			"pig":"pig",
			"pigAction":"growls"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
			"tutorial_image":"images/upRoar/tutorial_image_ES.png",
			"duck":"pato",
			"duckAction":"grazna",
			"parrot":"loro",
			"parrotAction":"garrira",
			"cow":"vaca",
			"cowAction":"muge",
			"dog":"perro",
			"dogAction":"ladra",
			"frog":"rana",
			"frogAction":"croa",
			"horse":"caballo",
			"horseAction":"relincha",
			"lion":"leon",
			"lionAction":"ruge",
			"pig":"cerdo",
			"pigAction":"guarre"
		}
	}
	

	var assets = {
        atlases: [
            {   
                name: "atlas.upRoar",
                json: "images/upRoar/atlas.json",
                image: "images/upRoar/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/upRoar/timeAtlas.json",
                image: "images/upRoar/timeAtlas.png",
            },
        ],
        images: [
            
            {
				name:'tutorial_image',
				file:"%lang",
			},
			{
				name:'BG_TILE',
				file:"images/upRoar/tile.png"
			}

		],
        spines: [
			{
				name:"animalsQuad",
				file:"images/Spine/animals/quadrupeds/quadrupeds.json"
			},
			{
				name:"animalsBird",
				file:"images/Spine/animals/birds/birds.json"
			}
        ],
        spritesheets: [
            {
                name:"coin",
                file:"images/Spine/coin/coin.png",
                width:122,
                height:123,
                frames:12
            },
			{
                name:"hand",
                file:"images/Spine/hand/hand.png",
                width:115,
                height:111,
                frames:23
            }
			
        ],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "ship",
				file: soundsPath + "robotBeep.mp3"},
            {   name:"dog",
				file: soundsPath + 'animals/dogShort.mp3'},
			{   name:"parrot",
				file: soundsPath + 'animals/parrotShort.mp3'},
			{   name:"lion",
				file: soundsPath + 'animals/lionShort.mp3'},
			{   name:"duck",
				file: soundsPath + 'animals/duckShort.mp3'},
			{   name:"pig",
				file: soundsPath + 'animals/pigShort.mp3'},
			{   name:"horse",
				file: soundsPath + 'animals/horseShort.mp3'},
			{   name:"frog",
				file: soundsPath + 'animals/frogShort.mp3'},
			{   name:"cow",
				file: soundsPath + 'animals/cowShort.mp3'},
			{   name:"acornSong",
				file: soundsPath + 'songs/farming_time.mp3'}
		],
        jsons: [
			{
				name: 'pickedEnergy', 
				file:  particlesPath + 'pickedEnergy/specialBar1.json'
			}
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var skinCorrect
	var particlesGroup, particlesUsed
    var gameIndex = 219
    var tutoGroup
	var indexGame
	var blockButton;
	var btn1, btn2,btn3,bar;
    var overlayGroup
    var baseSong
	var tutorial;
	var animal;
	var level;
	var correctAnswer;
	var backAnimated;
	var maxAnimals=7;
	var timeSpeed=5000;
	var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
	var fontStyle2 = {font: "35px VAGRounded", fontWeight: "bold", fill: "#550055", align: "center"}
	var choices=[
		{"choice1":"","choice2":"","choice3":""},
	];
	var animals=[
			{skinAndSound:"duck",animal:localization.getString(localizationData,"duck"),solution:localization.getString(localizationData,"duckAction")},
			{skinAndSound:"parrot",animal:localization.getString(localizationData,"parrot"),solution:localization.getString(localizationData,"parrotAction")},
			{skinAndSound:"cow",animal:localization.getString(localizationData,"cow"),solution:localization.getString(localizationData,"cowAction")},
			{skinAndSound:"dog",animal:localization.getString(localizationData,"dog"),solution:localization.getString(localizationData,"dogAction")},
			{skinAndSound:"frog",animal:localization.getString(localizationData,"frog"),solution:localization.getString(localizationData,"frogAction")},
			{skinAndSound:"horse",animal:localization.getString(localizationData,"horse"),solution:localization.getString(localizationData,"horseAction")},
			{skinAndSound:"lion",animal:localization.getString(localizationData,"lion"),solution:localization.getString(localizationData,"lionAction")},
			{skinAndSound:"pig",animal:localization.getString(localizationData,"pig"),solution:localization.getString(localizationData,"pigAction")}
	];
	var words=[
	]
    var backgroundGroup=null
    var UIGroup=null
    var animalGroup=null
    
    var tweenTiempo
    var clock, timeBar
	var startTiming=500;
    var delayDefault=100;
    var delayerTimer=2500;
	var passing;
    var emitter
	var timer
	
 
	function loadSounds(){
		sound.decode(assets.sounds)
	}
	function initialize(){
        game.stage.backgroundColor = "#000000"
        lives = 3
		blockButton=true;
		tutorial=true;
		animals=[
			{skinAndSound:"duck",animal:localization.getString(localizationData,"duck"),solution:localization.getString(localizationData,"duckAction")},
			{skinAndSound:"parrot",animal:localization.getString(localizationData,"parrot"),solution:localization.getString(localizationData,"parrotAction")},
			{skinAndSound:"cow",animal:localization.getString(localizationData,"cow"),solution:localization.getString(localizationData,"cowAction")},
			{skinAndSound:"dog",animal:localization.getString(localizationData,"dog"),solution:localization.getString(localizationData,"dogAction")},
			{skinAndSound:"frog",animal:localization.getString(localizationData,"frog"),solution:localization.getString(localizationData,"frogAction")},
			{skinAndSound:"horse",animal:localization.getString(localizationData,"horse"),solution:localization.getString(localizationData,"horseAction")},
			{skinAndSound:"lion",animal:localization.getString(localizationData,"lion"),solution:localization.getString(localizationData,"lionAction")},
			{skinAndSound:"pig",animal:localization.getString(localizationData,"pig"),solution:localization.getString(localizationData,"pigAction")}
		];
		for(var fillWords=0;fillWords<animals.length;fillWords++){
			passing={
				solution:animals[fillWords].solution,
			};
			words.push(passing);
		}
		level=0;
        emitter="";
		timer=12000;
		timeSpeed=5000;
        loadSounds()
	}
    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
		//sound.play("dog");
		tutorialLevel();
    }
    function createTutorial(){
        
        tutoGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(tutoGroup)
        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
        },this)
    }
    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

    }
	
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 
    
    function addNumberPart(obj,number,isScore){
        
        var pointsText = lookParticle('text')
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            pointsText.anchor.setTo(0.5,0.5)
            pointsText.setText(number)
            pointsText.scale.setTo(1,1)

            var offsetY = -100

            pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
            
            deactivateParticle(pointsText,800)
            if(isScore){
                
                pointsText.scale.setTo(0.7,0.7)
                var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
                tweenScale.onComplete.add(function(){
                    game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
                })

                offsetY = 100
            }
            
            game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        }
        
    }
    function missPoint(){
        
        sound.play("wrong")
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
			baseSong.stop();
            stopGame(false)
        }
        
        addNumberPart(heartsGroup.text,'-1',true)
        
    }
    
    function addPoint(number){
        
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.upRoar','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.45
        pointsText.y = pointsImg.height * 0.25
        pointsBar.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.upRoar','life_box')

        pivotX+= heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = heartImg.height * 0.15
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
    function stopGame(win){
        
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){		
        game.stage.disableVisibilityChange = false;
        epicparticles.loadEmitter(game.load, "pickedEnergy") 
    }
    
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
	   	backgroundGroup = game.add.group()
		sceneGroup.add(backgroundGroup)
		
		UIGroup=game.add.group();
		sceneGroup.add(UIGroup);
		
		animalGroup=game.add.group();
		sceneGroup.add(animalGroup);
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
		//game.time.advancedTiming = true;
 		
		
		animal=game.add.sprite(game.world.width/2,game.world.height/2,"atlas.upRoar","star")
		animal.alpha=0;
		animal.anchor.setTo(0.5,0.5)
		animal.spine=game.add.spine(0,0,"animalsQuad");
		animal.spine.setSkinByName(animals[3].skinAndSound);
		animal.spine.setAnimationByName(0, "idle", true);
		animal.spine.x=-400;
		animal.spine.y=game.world.height/1.3;
		animalGroup.add(animal)
		
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        
        backAnimated=game.add.tileSprite(0,0,game.world.width,game.world.height,"BG_TILE");
		backgroundGroup.add(backAnimated);
		
		
		btn1=game.add.sprite(game.world.centerX-180,game.world.height-100,"atlas.upRoar","button");
		btn2=game.add.sprite(game.world.centerX,game.world.height-100,"atlas.upRoar","button");
		btn3=game.add.sprite(game.world.centerX+180,game.world.height-100,"atlas.upRoar","button");
		
		btn1.tag="1";
		btn2.tag="2";
		btn3.tag="3";
		
		btn1.inputEnabled=true;
        btn2.inputEnabled=true;
        btn3.inputEnabled=true;
		
		btn1.events.onInputDown.add(selectOption,this);
		btn2.events.onInputDown.add(selectOption,this);
		btn3.events.onInputDown.add(selectOption,this);
		
		btn1.anchor.setTo(0.5,0.5);
		btn2.anchor.setTo(0.5,0.5);
		btn3.anchor.setTo(0.5,0.5);
		
		bar=game.add.sprite(game.world.centerX,200,"atlas.upRoar","bar");
		bar.anchor.setTo(0.5,0.5);
		bar.text=game.add.text(bar.centerX-100,bar.centerY,"bar", fontStyle2);
		bar.text.anchor.setTo(0.5,0.5);
		
		bar.textAnswer=game.add.text(bar.centerX+60,bar.centerY,"", fontStyle2);
		bar.textAnswer.anchor.setTo(0.5,0.5);
		
		btn1.text=game.add.text(btn1.centerX,btn1.centerY,"btn1", fontStyle);
		btn2.text=game.add.text(btn2.centerX,btn2.centerY,"btn2", fontStyle);
		btn3.text=game.add.text(btn3.centerX,btn3.centerY,"btn3", fontStyle);
		
		btn1.text.anchor.setTo(0.5,0.5);
		btn2.text.anchor.setTo(0.5,0.5);
		btn3.text.anchor.setTo(0.5,0.5);
		
		UIGroup.add(btn1);
		UIGroup.add(btn1.text);
		UIGroup.add(btn2);
		UIGroup.add(btn2.text);
		UIGroup.add(btn3);
		UIGroup.add(btn3.text);
		UIGroup.add(bar);
		UIGroup.add(bar.text);
		UIGroup.add(bar.textAnswer);
		UIGroup.alpha=0;
		
		hand=game.add.sprite(game.world.centerX,game.world.centerY, "hand")
        hand.anchor.setTo(0,0);
        hand.scale.setTo(1,1);
        hand.animations.add('hand');
        hand.animations.play('hand', 24, true);
        hand.alpha=1;
        UIGroup.add(hand);
		
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin");
        coins.anchor.setTo(0.5);
        coins.scale.setTo(0.5);
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0;
    }
	function selectOption(obj){
		if(!blockButton){
			if(!tutorial)stopTimer();
			tutorial=false;
			hand.alpha=0;
			blockButton=true;
			if(obj.text.text!=correctAnswer){
				sound.play(animals[obj.id].skinAndSound)
			}
			bar.textAnswer.text=correctAnswer;
			game.time.events.add(500,function(){
			if(obj.text.text==correctAnswer){
				Coin(animal,pointsBar,10);
				sound.play(animals[obj.id].skinAndSound)
				animal.spine.setAnimationByName(0,"win",true);
				level++;
				if(timer>100){
					timer=timer-500;
				}
				reset();
			}else{
				missPoint();
				animal.spine.setAnimationByName(0,"lose",true);
				reset();
			}
			});
		}
	}
	function tutorialLevel(){
		
		
		var randAnimal=3;
		var correctAnimal=randAnimal;
		if(localization.getLanguage()=="ES"){
			bar.text.text="El "+animals[3].animal;
		}else{
			bar.text.text="The "+animals[3].animal;
		}
		correctAnswer=animals[3].solution;
		//btn1.text.text=animals[3].solutionEN;
		var chooseBtn=game.rnd.integerInRange(0,2);
			if(chooseBtn==0)choices[0].choice1=words[3].solution;
			if(chooseBtn==1)choices[0].choice2=words[3].solution;
			if(chooseBtn==2)choices[0].choice3=words[3].solution;
			words[3].solution="";
		if(chooseBtn==0){
			btn1.id=3;
			hand.x=btn1.x;
			hand.y=btn1.y;
		}else if(chooseBtn==1){
			btn2.id=3;
			hand.x=btn2.x;
			hand.y=btn2.y;
		}else if(chooseBtn==2){
			btn3.id=3;
			hand.x=btn3.x;
			hand.y=btn3.y;
		}
		while(choices[0].choice1=="" || choices[0].choice2=="" || choices[0].choice3==""){
			
			chooseBtn=game.rnd.integerInRange(0,2);
			randAnimal=game.rnd.integerInRange(0,maxAnimals);
				if(chooseBtn==0 && choices[0].choice1==""){
					choices[0].choice1=words[randAnimal].solution;
					words[randAnimal].solution="";
					btn1.id=randAnimal;
				}
				if(chooseBtn==1 && choices[0].choice2==""){
					choices[0].choice2=words[randAnimal].solution;
					words[randAnimal].solution="";
					btn2.id=randAnimal;
				}
				if(chooseBtn==2 && choices[0].choice3==""){
					choices[0].choice3=words[randAnimal].solution;
					words[randAnimal].solution="";
					btn3.id=randAnimal;
				}
		}
		
		btn1.text.text=choices[0].choice1;
		btn2.text.text=choices[0].choice2;
		btn3.text.text=choices[0].choice3;
		
		
		
		bar.line = new Phaser.Line(bar.centerX-5,bar.centerY+15, bar.centerX+130, bar.centerY+15);
		bar.graphics=game.add.graphics(0,0);
        bar.graphics.lineStyle(5, 0x550055, 1);
        bar.graphics.moveTo(bar.line.start.x,bar.line.start.y);
        bar.graphics.lineTo(bar.line.end.x,bar.line.end.y);
        bar.graphics.endFill();
		UIGroup.add(bar.graphics)
		sound.play(animals[correctAnimal].skinAndSound);
		game.add.tween(animal.spine).to({x:game.world.centerX-20,y:game.world.height/1.3},1050,Phaser.Easing.linearIn,true).onComplete.add(function(){
			game.add.tween(UIGroup).to({alpha:1}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
				blockButton=false;
			});
		});
	}
    function Coin(objectBorn,objectDestiny,time){
        //objectBorn= Objeto de donde nacen
        coins.x=objectBorn.centerX
        coins.y=objectBorn.centerY
        
        emitter = epicparticles.newEmitter("pickedEnergy")
        emitter.duration=0.05;
        emitter.x = coins.x
        emitter.y = coins.y
        game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
        game.add.tween(coins).to({y:objectBorn.centerY-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
            game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
            game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
                coins.x=objectBorn.centerX
                coins.y=objectBorn.centerY
                addPoint(1)
            })
        })
    }
  
    
	function update(){
        
		//game.debug.text(game.time.fps, 50,100, "white")
        if(startGame){
            epicparticles.update()
			if(backAnimated){
				backAnimated.tilePosition.x+=0.2;
				backAnimated.tilePosition.y-=0.2;
			}
        }

	}
     function positionTimer(){
        clock=game.add.image(game.world.centerX-150,50,"atlas.time","clock")
        clock.scale.setTo(.7)
        timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
        timeBar.scale.setTo(8,.45)
        timeBar.alpha=1;
        clock.alpha=1;
        backgroundGroup.add(clock)
        backgroundGroup.add(timeBar)
        UIGroup.add(clock);
        UIGroup.add(timeBar);
    }
    function stopTimer(){
        tweenTiempo.stop()
        tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, startTiming, Phaser.Easing.Linear.Out, true, delayDefault).onComplete.add(function(){
        })
    }
    function startTimer(time){
        tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, delayDefault)
        tweenTiempo.onComplete.add(function(){
            stopTimer()
			blockButton=true;
			sound.play(skinCorrect)
			bar.textAnswer.text=correctAnswer;
			game.time.events.add(1200,function(){
				missPoint();
				animal.spine.setAnimationByName(0,"lose",true);
				reset();
			});
        })
    }
	function nextLevelAndDificulty(level){
		
		//timeSpeed=timeSpeed-(level*200);
		var randAnimal=game.rnd.integerInRange(0,maxAnimals);
		var correctAnimal=randAnimal;
		skinCorrect=animals[randAnimal].skinAndSound;
		if(localization.getLanguage()=="ES"){
			bar.text.text="El "+animals[randAnimal].animal;
		}else{
			bar.text.text="The "+animals[randAnimal].animal;
		}
		correctAnswer=animals[randAnimal].solution;
		var animalVariant="";
		if(randAnimal>=2){
			animalVariant="animalsQuad";
		}else{
			animalVariant="animalsBird";
		}
		var chooseBtn=game.rnd.integerInRange(0,2);
		if(chooseBtn==0)choices[0].choice1=words[randAnimal].solution;
		if(chooseBtn==1)choices[0].choice2=words[randAnimal].solution;
		if(chooseBtn==2)choices[0].choice3=words[randAnimal].solution;
			words[randAnimal].solution="";
		if(chooseBtn==0){
			btn1.id=randAnimal;
		}else if(chooseBtn==1){
			btn2.id=randAnimal;
		}else if(chooseBtn==2){
			btn3.id=randAnimal;
		}
		var chooseBtn=game.rnd.integerInRange(0,2);
		
		while(choices[0].choice1=="" || choices[0].choice2=="" || choices[0].choice3==""){
			chooseBtn=game.rnd.integerInRange(0,2);
			randAnimal=game.rnd.integerInRange(0,maxAnimals);
			if(chooseBtn==0 && choices[0].choice1==""){
				choices[0].choice1=words[randAnimal].solution;
				words[randAnimal].solution="";
				btn1.id=randAnimal;
			}
			if(chooseBtn==1 && choices[0].choice2==""){
				choices[0].choice2=words[randAnimal].solution;
				words[randAnimal].solution="";
				btn2.id=randAnimal;
			}
			if(chooseBtn==2 && choices[0].choice3==""){
				choices[0].choice3=words[randAnimal].solution;
				words[randAnimal].solution="";
				btn3.id=randAnimal;
			}
		}
		btn1.text.text=choices[0].choice1;
		btn2.text.text=choices[0].choice2;
		btn3.text.text=choices[0].choice3;
		
		animal.spine.destroy();
		animal.spine=game.add.spine(-400,game.world.height/1.3,animalVariant);
		animal.spine.setSkinByName(skinCorrect);
		animal.spine.setAnimationByName(0,"idle",true);
		animalGroup.add(animal.spine);
		if(level<5){
			sound.play(animals[correctAnimal].skinAndSound);
		}
		game.add.tween(animal.spine).to({x:game.world.centerX-20,y:game.world.height/1.3},1050,Phaser.Easing.linearIn,true).onComplete.add(function(){
			game.add.tween(UIGroup).to({alpha:1}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
				startTimer(timer)
				blockButton=false;
			});	
		});
	}
 
    
    function reset(){
		
		for(var resetWords=0;resetWords<animals.length; resetWords++){
			words[resetWords].solution=animals[resetWords].solution;
		}
		choices[0].choice1="";
		choices[0].choice2="";
		choices[0].choice3="";
		game.add.tween(UIGroup).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,500);
		game.add.tween(animal.spine).to({x:game.world.width+400,y:game.world.height/1.3},1050,Phaser.Easing.linearIn,true,1000).onComplete.add(function(){
			bar.textAnswer.text="";
			nextLevelAndDificulty(level)
			if(!tutorial)positionTimer()
		});
            
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
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.upRoar',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
        return particle
    }
    
    function createParticles(tag,number){
                
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'text'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                var particle = game.add.emitter(0, 0, 100);

				particle.makeParticles('atlas.upRoar',tag);
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

	function setExplosion(obj){
        
        var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
        
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xffffff)
        rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect.alpha = 0
        rect.endFill()
		sceneGroup.add(rect)
		
		game.add.tween(rect).from({alpha:1},500,"Linear",true)
		
        var exp = sceneGroup.create(0,0,'atlas.upRoar','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.upRoar','smoke');
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = posX;
        particlesGood.y = posY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
	}
	
	return {
		
		assets: assets,
		localizationData: localizationData,
		name: "upRoar",
        preload:preload,
        update:update,
		getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
            create: function(event){
            
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            baseSong = game.add.audio('acornSong')
            game.sound.setDecodedCallback(baseSong, function(){
                baseSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
				buttons.getButton(baseSong,sceneGroup)
            initialize()
            
			            
			createPointsBar()
			createHearts()
            createTutorial()
			
			
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()