var soundsPath = "../../shared/minigames/sounds/";
var imagePath = "images/pizzafraction/";


var pizzafraction = function(){

	assets = {
		atlases: [                
			{
				name: "atlas.pizza",
				json: "images/pizzafraction/atlas.json",
				image: "images/pizzafraction/atlas.png",
			},
			{
                name: "atlas.time",
                json: "images/pizzafraction/timeAtlas.json",
                image: "images/pizzafraction/timeAtlas.png",
            },
		],
		images: [
			{
				name:"bgclock",
				file:imagePath+"bgclock.png",
			},
			{   name:"tutorial_image",
			 	file:imagePath+"tutorial_image.png"},
			{
				name:"heartsIcon",
				file:imagePath+"hearts.png",
			},
			{
				name:"xpIcon",
				file:imagePath+"xpcoins.png",
			},
			{
				name:"background",
				file:imagePath+"background.png",
			},
			{
				name:"circles",
				file:imagePath+"circles.png",
			},
			{
				name:"base",
				file:imagePath+"base.png",
			},
			{
				name:"plato",
				file:imagePath+"plato.png",
			},
			{
				name:"globe",
				file:imagePath+"globe.png",
			},
			{
				name:"noveno1",
				file:imagePath+"noveno1.png",
			},
			{
				name:"timbre_iddle",
				file:imagePath+"timbre_iddle.png",
			},
			{
				name:"timbre_on",
				file:imagePath+"timbre_on.png",
			},
			{
				name:"star",
				file:imagePath+"star.png",
			},
			{
				name:"wrong",
				file:imagePath+"wrong.png",
			},


		],

		spines: [
			{
				name:"yogotar",
				file:imagePath+"spine/skeleton.json"
			}
		],
		sounds: [
			{	name: "pop",
			 file: soundsPath + "pop.mp3"},
            {	name: "bell",
			 file: soundsPath + "alarmBell.mp3"},
            {	name: "growl",
			 file: soundsPath + "growlDeep.mp3"},
			{	name: "magic",
			 file: soundsPath + "magic.mp3"},
			{	name: "wrong",
			 file: soundsPath + "wrong.mp3"},
			{	name: "whoosh",
			 file: soundsPath + "whoosh.mp3"},
            {	name: "eat",
			 file: soundsPath + "bite.mp3"},
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
			{	name: "pizzaSong",
			 file: soundsPath + "songs/pirates_song.mp3"},
		],
		spritesheets: [
            {   name: "coin",
                file: "images/pizzafraction/spine/coin/coin.png",
                width: 122,
                height: 123,
                frames: 12
            },
			{   name: "hand",
                file: "images/pizzafraction/spine/hand/hand.png",
                width: 115,
                height: 111,
                frames: 23
            },
		]

	}


	sceneGroup = null;
	var speedGame = 5;
	var background;
	var tutoGroup = null;
	var UIGroup=null
	var DEFAULT_NUM_PIZZAS=8;
	var FIRST_ANGLE=360;
	var FIRST_WIDTH=180;
	var heartsGroup = null;
	var heartsIcon;
	var timbre_iddle
	var plato
	var graphics
	var fractionPizza
	var delayDefault
	var tutorial
	var startGame
	var numPizzas
	var fractions
	var globe
	var clock, timeBar
	var textGlobe
	var poly
	var star
	var seconds
	var character
	var dificulty
	var coinS
	var correctAnswer
	var startTiming
	var hand
    var changing
	var yogotar
	timer = 10;
	timerCount = null;
	var xpIcon;

	var lives;
	var count = 0;
	var cursors;
	coins = 0;
	heartsText = null;	
	xpText = null;
	//bgm = null;
	var activeGame = true;


	styleWhite = {font: "40px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"};
	styleBlack = {font: "60px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };
	styleClock = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center",boundsAlignH: "center", boundsAlignV: "middle" };


	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){
		lives = 3;
		seconds=11;
		startTiming=500;
		tutorial=true
		count = 0;
		dificulty=0;
		coins = 0;
		speedGame = 5;
		delayDefault=100;
		startGame = false;

	}	

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


	function positionTimer(){
		
        clock=game.add.image(game.world.centerX-150,50,"atlas.time","clock")
        clock.scale.setTo(.7)
        timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
        timeBar.scale.setTo(8,.45)
        timeBar.alpha=1;
        clock.alpha=1;
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
            correctAnswer=fractions[0].id;
			missPoint(correctAnswer)
            changing=true;
			if(lives>0){
				newPizza()
			}
            stopTimer()
        })
    }
	/*CREATE SCENE*/
	
	
	function onPress(pizza){
			if(!pizza.pizza.over){
				count = count + 1;
                if(tutorial){
                    hand.x=timbre_iddle.x+50;
                    hand.y=timbre_iddle.y+50;
                }
                sound.play("eat")
				pizza.pizza.blendMode = 0;
				pizza.pizza.over = true;
			}else{
                sound.play("growl")
                if(tutorial){
                    hand.x=graphics[6].x;
                    hand.y=graphics[6].y+100;
                }
				count = count - 1;
				pizza.pizza.blendMode = 3;
				pizza.pizza.over = false;
			}
		}
	function createScene(){


		loadSounds()
        
		//yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel);
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		count = 0;

		var background = new Phaser.Graphics(game)
		background.beginFill(0xf15a24)
		background.drawRect(0,0,game.world.width *2, game.world.height *2)
		background.alpha = 1
		background.endFill()
		sceneGroup.add(background);

		fractionPizza = new Array;
		graphics = new Array;
		numPizzas = 8;

		var circles = sceneGroup.create(0,0,"circles");
		circles.y = 0;
		circles.x = game.world.centerX - circles.width/2;		

		var base = sceneGroup.create(0,0,"base");
		base.y = game.height - base.height;
		base.x = game.world.centerX - base.width/2;

		plato = sceneGroup.create(0,0,"plato");
		plato.y = game.height - base.height - plato.height;
		plato.x = game.world.centerX - plato.width/2;


		characters = ["dinamita","estrella","nao","tomiko"];

		yogotar1 = game.add.spine(0,0,"yogotar");
		yogotar1.y = game.height  - 10;
		yogotar1.x = base.x + base.width/5;
		yogotar1.posx = base.x + base.width/5;
		yogotar1.setAnimationByName(0, "IDLE", true);
		yogotar1.setSkinByName(characters[0]);
		sceneGroup.add(yogotar1);	
        
		fractions = [];
		//shuffle(fractions)
		numPizzas=8
		increasingDificulty(numPizzas)
		
		globe = sceneGroup.create(0,0,"globe");
		globe.x = base.x + globe.width*1.15;
		globe.y = base.y + globe.height/6;	
		textGlobe = game.add.text(50, 10, fractions[0].fraction, styleBlack,sceneGroup);	
		textGlobe.anchor.setTo(0,0.3);
		textGlobe.setTextBounds(globe.x,globe.y,globe.width/2,globe.height);

		
		
		
		star = sceneGroup.create(0,0,"star");
		star.scale.setTo(2);
		star.anchor.setTo(0.5,0.5);
		star.x = plato.x + plato.width/2;
		star.y = plato.y + plato.height/2;
		star.alpha= 0;
		
		
		timbre_iddle = sceneGroup.create(0,0,"timbre_iddle");
		timbre_iddle.x = globe.x + timbre_iddle.width;
		timbre_iddle.y = globe.y + timbre_iddle.height + 10; 
		timbre_iddle.inputEnabled = false;
		timbre_iddle.events.onInputDown.add(onPressBell,this);
		timerFunction = function(){
			if(timer != 0){
				timer-- 
				if(timer==0){
					clearInterval(timerCount);
                    correctAnswer=fractions[0].id;
					missPoint(correctAnswer)
                    changing=true;
					sound.play("wrong");
					//bgm.stop();	
				}
			}
			clockText.setText(timer);
		}		
		bgclock = sceneGroup.create(0,1,"bgclock");
		bgclock.x = game.width * 0.5;
		bgclock.anchor.setTo(0.5, 0);
		clockText = game.add.text(50, 46, timer, styleClock,sceneGroup);	
		clockText.x = game.width * 0.5;
		clockText.anchor.setTo(0.5, 0);
		bgclock.alpha = 0;
		clockText.alpha = 0;

		//createCoins(coins);

	}
	function createHearts(lives){

		heartsGroup = game.add.group()
		heartsGroup.y = 10
		sceneGroup.add(heartsGroup)
		var pivotX = 10
		var group = game.add.group()
		group.x = pivotX
		heartsGroup.add(group)

		var heartImg = group.create(0,0,'atlas.pizza','hearts')

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

	function createPointsBar(){

		pointsBar = game.add.group()
		pointsBar.x = game.world.width
		pointsBar.y = 0
		sceneGroup.add(pointsBar)

		var pointsImg = pointsBar.create(-10,10,'atlas.pizza','xpcoins')
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
 	function addPoint(number){
        
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
		
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
    }
	
	function missPoint(feedBack){
        
        console.log(fractions[0].id, feedBack)
		sound.play("wrong")
		createPart('smoke',yogotar1)
		for(var allTiles=0; allTiles<numPizzas; allTiles++){
			fractionPizza[allTiles].blendMode = 3;
			fractionPizza[allTiles].over = false;
		}
		for(var correctTiles=0; correctTiles<feedBack; correctTiles++){
			fractionPizza[correctTiles].blendMode = 0;
			fractionPizza[correctTiles].over = false;
		}
		
		lives--;
		heartsGroup.text.setText('X ' + lives)

		var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
		scaleTween.onComplete.add(function(){
			game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
		})
		if(lives == 0){
			stopGame(true)
		}else{
			game.time.events.add(3000,function(){
				newPizza()	
			})
		}
		createTextPart('-1',heartsGroup.text)
	}
	function createCoin(){
        
       coinS = game.add.sprite(0, 0, "coin")
       coinS.anchor.setTo(0.5)
       coinS.scale.setTo(0.8)
       coinS.animations.add('coin')
       coinS.animations.play('coin', 24, true)
       coinS.alpha = 0
        
        hand = game.add.sprite(0, 0, "hand")
        hand.animations.add('hand')
        hand.animations.play('hand', 24, true)
        hand.alpha = 0

    }

	function createTextPart(text,obj){
        
        var pointsText = lookParticle('text')
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            pointsText.setText(text)
            pointsText.scale.setTo(0.7,0.7)

            game.add.tween(pointsText).to({y:pointsText.y + 75},750,Phaser.Easing.linear,true)
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
            //console.log(obj)
            particle.x = obj.worldPosition.x + offX
            particle.y = obj.worldPosition.y + 520
            particle.scale.setTo(0.5,0.5)
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
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                var particle = game.add.emitter(0, 0, 100);

				particle.makeParticles('atlas.pizza',tag);
				particle.minParticleSpeed.setTo(-300, -100);
				particle.maxParticleSpeed.setTo(400, -400);
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
		createParticles('text',5)
		createParticles('smoke',1)

	}
	
	 function addCoin(obj){
        
        if(coinS.motion)
            coinS.motion.stop()
        
		createPart('star',yogotar1,450)
        coinS.x = obj.centerX
        coinS.y = obj.centerY

        game.add.tween(coinS).to({alpha:1}, 200, Phaser.Easing.linear, true)
        
        coinS.motion = game.add.tween(coinS).to({y:coinS.y - 100}, 300, Phaser.Easing.Cubic.InOut,true)
        coinS.motion.onComplete.add(function(){
            coinS.motion = game.add.tween(coinS).to({x: pointsBar.centerX, y:pointsBar.centerY}, 300, Phaser.Easing.Cubic.InOut,true)
            coinS.motion.onComplete.add(function(){
                coinS.motion = game.add.tween(coinS).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true)
                coinS.motion.onComplete.add(function(){
                   	addPoint(1)
					createTextPart('+1',pointsBar.text)
                })
            })
        })
	 }
	
	function onPressBell(bell){
        
        if(!changing){
           if(!tutorial)sound.play("bell")
            if(timer == 0){
                return
            }
            correctAnswer=fractions[0].id;
            console.log(correctAnswer)

            if(fractions[0].id == count){
                sound.play("magic");
                addCoin(yogotar1);
                if(pointsBar.number%5==0 && pointsBar.number!=1 && pointsBar.number!=0 && numPizzas<14){
                    if(pointsBar.number==10){
                        dificulty=3;
                    }
                    numPizzas++
                    increasingDificulty(numPizzas)
                }
                yogotar1.setAnimationByName(0, "WIN", true);
                TweenMax.fromTo(star.scale,3,{x:4,y:4},{x:8,y:8})
                TweenMax.fromTo(star,3,{alpha:0},{alpha:0,onComplete:newPizza});
                tutorial=false;
                for(i=0;i<=numPizzas-1;i++){
                    graphics[i].inputEnabled = false;
                }
            }else if(fractions[0].id != count && !tutorial){
                //bgm.stop();
                sound.play("wrong");
                for(i=0;i<=numPizzas-1;i++){
                    graphics[i].inputEnabled = false;
                }
                yogotar1.setAnimationByName(0, "LOSE", true);
                missPoint(correctAnswer)
            }

            if(!tutorial){
                hand.alpha=0;
                timbre_iddle.inputEnabled = false;
                bell.alpha= 1;
                TweenMax.fromTo(bell,0.5,{y:bell.y + 20},{y:bell.y,ease:Elastic.easeOut,onComplete:completeBell});
                function completeBell(){
                    bell.alpha= 1;
                }

                if(pointsBar.number == 4){
                    positionTimer()
                }
                if(pointsBar.number> 4){
                    stopTimer()
                }
            }
        }
	}		
	
	
	function increasingDificulty(numberPizzas){
		
		var numberWidth= ((FIRST_WIDTH/numberPizzas)*DEFAULT_NUM_PIZZAS);
		var numberAngle= ((FIRST_ANGLE/numberPizzas));
		var polyPoint1=((FIRST_ANGLE/numberPizzas)*2);
		var polyPoint2=((-FIRST_ANGLE/numberPizzas)*2);
		var newFractions=null;
		var thirdDificultyNum;
		var thirdDificultyDen;
		var divideBy;
		
		if(numberPizzas%2==0){
			divideBy=2;
		}else if(numberPizzas%3==0){
			divideBy=3;
		}else{
			divideBy=1;
		}
		
		poly = new Phaser.Polygon([ new Phaser.Point(0,0), 
									   new Phaser.Point(polyPoint1, 225), 
									   new Phaser.Point(polyPoint2, 225) ]);
		
		for(var destroy=0;destroy<=numberPizzas-1;destroy++){	
			if(fractionPizza[destroy]){
				fractionPizza[destroy].destroy();
				graphics[destroy].destroy();
			}
		}
		fractions=[]
		for(i=0;i<=numberPizzas-1;i++){
			if((i+1)%divideBy==0 && dificulty==3 && (i+1)!=1){
				thirdDificultyNum=(i+1)/divideBy;
				thirdDificultyDen=numberPizzas/divideBy
                console.log("Joal")
			}else{
				thirdDificultyNum=i+1;
				thirdDificultyDen=numberPizzas
			}
			newFractions={fraction:thirdDificultyNum+'/'+thirdDificultyDen,id:i+1};
			fractions.push(newFractions)
			
			
			fractionPizza[i] = sceneGroup.create(0,0,"noveno1");
			fractionPizza[i].anchor.setTo(0.5,1);
			fractionPizza[i].y = plato.y + fractionPizza[i].height + plato.height/20
			fractionPizza[i].x = plato.x + plato.width/2;  
			fractionPizza[i].width = numberWidth
			fractionPizza[i].blendMode = 3;
			fractionPizza[i].angle = i * numberAngle; 
			fractionPizza[i].inputEnabled = true;
			fractionPizza[i].over = false;

			graphics[i] = game.add.graphics(0, 0);
			graphics[i].beginFill(0x00ff00);
			graphics[i].drawPolygon(poly.points);
			graphics[i].y = plato.y + fractionPizza[i].height + plato.height/20
			graphics[i].x = plato.x + plato.width/2;
			graphics[i].alpha = 0
			graphics[i].angle = i * numberAngle + 180;
			graphics[i].inputEnabled = false;
			graphics[i].pizza = fractionPizza[i]
			graphics[i].endFill()
			if(isMobile.any()){
				graphics[i].events.onInputOver.add(onPress,this);
			}else{
				graphics[i].events.onInputDown.add(onPress,this);	   
			}
		}
	}
	function newPizza(){
		TweenMax.fromTo(yogotar1,1,{x:yogotar1.x},{x:yogotar1.x + game.width + 100,onComplete:newYogotar});
		if(pointsBar.number >= 4){
			if(seconds>1){
				seconds--;
			}
		}
		function newYogotar(){
			
			shuffle(fractions);
			shuffle(characters);
			count = 0;
			for(i=0;i<=numPizzas-1;i++){
				fractionPizza[i].blendMode = 3;
				fractionPizza[i].over = false;
			}
			textGlobe.setText(fractions[0].fraction);
			TweenMax.fromTo(yogotar1,1,{x:-300},{x:yogotar1.posx});
			game.time.events.add(1000,function(){
				timbre_iddle.inputEnabled = true;
				for(i=0;i<=numPizzas-1;i++){
					graphics[i].inputEnabled = true;
				}
				if(pointsBar.number>4)startTimer(3600*seconds);
			})
			yogotar1.setSkinByName(characters[0]);
			yogotar1.setAnimationByName(0, "IDLE", true);
			sound.play("powerup");
            changing=false
		}
	}
	function stopGame(win){
		sound.play("wrong")
		gameActive = false
		sound.play("gameLose")
        pizzaSong.stop()
        
		yogotar1.setAnimationByName(0,"LOSE",true)
		tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 2000)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number)
			sceneloader.show("result")
		})
	}
	function onClickPlay(rect) {
		tutoGroup.y = -game.world.height
		startGame=true
		//for(var inputActive=0; inputActive<numPizzas; inputActive++){
        graphics[4].inputEnabled = true;
		//}
        hand.alpha=1;
        hand.x=graphics[5].x;
        hand.y=graphics[5].y+100;
		timbre_iddle.inputEnabled = true;
		//tutorialLevel();
	}
	function createTutorial(){

		tutoGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
		sceneGroup.add(tutoGroup)
		tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
	}
	return {
		assets: assets,
		name: "pizzafraction",
		create: function(event){
			sceneGroup = game.add.group()
			createCoin()
			createScene()
			initialize()
			createHearts(lives)
			createPointsBar()
			addParticles()
			
			pizzaSong = game.add.audio('pizzaSong')
            game.sound.setDecodedCallback(pizzaSong, function(){
                pizzaSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
			buttons.getButton(pizzaSong,sceneGroup)
			createTutorial()
			UIGroup=game.add.group();
			sceneGroup.add(UIGroup)
			
			
			
		},
		show: function(event){

		}
	}
}()