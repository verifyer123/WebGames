
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var tutorialPath = "../../shared/minigames/"
var base = function(){
    
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
                //name: "atlas.bouncybath",
                //json: "images/bouncybath/atlas.json",
                //image: "images/bouncybath/atlas.png",
			},
],
        images: [
			{
				name:"bgclock",
				file:imagePath+"bgclock.png",
			},
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
			{	name: "sillyAdventureGameLoop",
				file: soundsPath + "songs/sillyAdventureGameLoop.mp3"},
		],
		spritesheets: [
            {
                name:"coin",
                file:"images/pizzafraction/spine/coin/coin.png",
                width:122,
                height:123,
                frames:12
            },
			{
                name:"hand",
                file:"images/pizzafraction/spine/hand/hand.png",
                width:115,
                height:111,
                frames:23
            }
			
        ],
		
	}
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 1
    var tutoGroup
	var indexGame
    var overlayGroup
    var baseSong
    
    var backgroundGroup=null
    
    var tweenTiempo
    var clock, timeBar
    var emitter

	var gameIndex = 42;
	var speedGame = 5;
	var tutoGroup = null;
	var timbreIdle;
	var heartsGroup = null;
	var pointsBar = null;
	var heartsIcon;
	var graphics;
	var numPizzas ;
	var timer = 10;
	var timerCount = null;
	var xpIcon;
	
	var lives = 3;
	var count = 0;
	var cursors;
	//coins = 0;
	var heartsText = null;	
	var xpText = null;
	var bgm = null;
	var activeGame = true;

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){
          
        game.stage.backgroundColor = "#000000"
        lives = 3
        emitter=""
        loadSounds()
	}

    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.base','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.base','life_box')

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
        
        
        
        
        baseSong.stop()
        		
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
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        //Circulo de prueba
        createCircleSprite(game.world.centerX, game.world.centerY,100,{inputCallback:inputs})
        
        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
    }
	 function createScene(){
		
		sceneGroup = game.add.group();
		tutoGroup = game.add.group();
		yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); ;
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.startSystem(Phaser.Physics.ARCADE);
        count = 0;
		loadSounds();
		var background = new Phaser.Graphics(game)
        background.beginFill(0xf15a24)
        background.drawRect(0,0,game.world.width *2, game.world.height *2)
        background.alpha = 1
        background.endFill()
		sceneGroup.add(background);
        
//		//Coins
//        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin");
//        coins.anchor.setTo(0.5);
//        coins.scale.setTo(0.5);
//        coins.animations.add('coin');
//        coins.animations.play('coin', 24, true);
//        coins.alpha=0;
		
        bgm = game.add.audio('sillyAdventureGameLoop')
		game.sound.setDecodedCallback(bgm, function(){
		}, this);
				
		bgm.loopFull(0.5);
		starGame = true;
		buttons.getButton(bgm,sceneGroup)

		var circles = sceneGroup.create(0,0,"circles");
		circles.y = 0;
		circles.x = game.world.centerX - circles.width/2;		
		
		var base = sceneGroup.create(0,0,"base");
		base.y = game.height - base.height;
		base.x = game.world.centerX - base.width/2;

		var plato = sceneGroup.create(0,0,"plato");
		plato.y = game.height - base.height - plato.height;
		plato.x = game.world.centerX - plato.width/2;
		
		
		var characters = ["dinamita","estrella","nao","tomiko"];
		
		var yogotar1 = game.add.spine(0,0,"yogotar");
		yogotar1.y = game.height  - 10;
		yogotar1.x = base.x + base.width/5;
		yogotar1.posx = base.x + base.width/5;
		yogotar1.setAnimationByName(0, "IDLE", true);
		yogotar1.setSkinByName(characters[0]);
		sceneGroup.add(yogotar1);	
		
		var fractions = [
			{fraction:"1/8",id:1},
			{fraction:"2/8",id:2},
			{fraction:"3/8",id:3},
			{fraction:"4/8",id:4},
			{fraction:"5/8",id:5},
			{fraction:"6/8",id:6},
			{fraction:"7/8",id:7},
			{fraction:"8/8",id:8},
			{fraction:"1/4",id:2},
			{fraction:"1/2",id:4}
		];
		//shuffle(fractions)
		
		var globe = sceneGroup.create(0,0,"globe");
			globe.x = base.x + globe.width*1.15;
			globe.y = base.y + globe.height/6;	
		var textGlobe = game.add.text(50, 10, fractions[0].fraction, styleBlack,sceneGroup);	
			textGlobe.anchor.setTo(0,0.3);
			textGlobe.setTextBounds(globe.x,globe.y,globe.width/2,globe.height);
        
        var poly = new Phaser.Polygon([ new Phaser.Point(0,0), 
                                        new Phaser.Point(90, 225), 
                                        new Phaser.Point(-90, 225) ]);

		var fractionPizza = new Array;
        graphics = new Array;
		numPizzas = 8;
		for(i=0;i<=numPizzas-1;i++){
			fractionPizza[i] = sceneGroup.create(0,0,"noveno1");
			fractionPizza[i].anchor.setTo(0.5,1);
			fractionPizza[i].y = plato.y + fractionPizza[i].height + plato.height/20
			fractionPizza[i].x = plato.x + plato.width/2;
			fractionPizza[i].width = 180
			fractionPizza[i].blendMode = 3; 
			fractionPizza[i].angle = i * 45;
			fractionPizza[i].inputEnabled = true;
			fractionPizza[i].over = false;
            
            graphics[i] = game.add.graphics(0, 0);
            graphics[i].beginFill(0x00ff00);
            graphics[i].drawPolygon(poly.points);
            graphics[i].y = plato.y + fractionPizza[i].height + plato.height/20
            graphics[i].x = plato.x + plato.width/2;
            graphics[i].alpha = 0
            graphics[i].angle = i * 45 + 180
            graphics[i].inputEnabled = false;
            graphics[i].pizza = fractionPizza[i]
            graphics[i].endFill()
            if(isMobile.any()){
			   graphics[i].events.onInputOver.add(onPress,this);
			   }else{
                   graphics[i].events.onInputDown.add(onPress,this);	   
			   }
        	
		}
		
		var star = sceneGroup.create(0,0,"star");
			star.scale.setTo(2);
			star.anchor.setTo(0.5,0.5);
			star.x = plato.x + plato.width/2;
			star.y = plato.y + plato.height/2;
			star.alpha= 0;
		
		function onPress(pizza){
			if(!pizza.pizza.over){
				count = count + 1;
				pizza.pizza.blendMode = 0;
				pizza.pizza.over = true;
			}else{
				count = count - 1;
				pizza.pizza.blendMode = 3;
				pizza.pizza.over = false;
			}
			
		}
		
		timbre_iddle = sceneGroup.create(0,0,"timbre_iddle");
		timbre_iddle.x = globe.x + timbre_iddle.width;
		timbre_iddle.y = globe.y + timbre_iddle.height + 10; 
		timbre_iddle.inputEnabled = false;
		timbre_iddle.events.onInputDown.add(onPressBell,this);
		
		function onPressBell(bell){
			
			if(timer == 0){
				return
			}
			

			timbre_iddle.inputEnabled = false;
			if(fractions[0].id == count){
				sound.play("magic");
				coins++;
				xpText.setText(coins);
				yogotar1.setAnimationByName(0, "WIN", true);
				TweenMax.fromTo(star.scale,3,{x:4,y:4},{x:8,y:8})
				TweenMax.fromTo(star,3,{alpha:1},{alpha:0,onComplete:newPizza});
				for(i=0;i<=numPizzas-1;i++){
					graphics[i].inputEnabled = false;
				}
			}else{
				missPoint()
				console.log(lives)
				if(lives==0){
					bgm.stop();
					sound.play("gameLose");
					for(i=0;i<=numPizzas-1;i++){
						graphics[i].inputEnabled = false;
					}
					yogotar1.setAnimationByName(0, "LOSE", true);
				}
			}
			
			bell.alpha= 1;
			TweenMax.fromTo(bell,0.5,{y:bell.y + 20},{y:bell.y,ease:Elastic.easeOut,onComplete:completeBell});
			function completeBell(){
					bell.alpha= 1;
			}
			
			if(coins == 3){
						bgclock.alpha = 1;
						clockText.alpha = 1;
						TweenMax.to(bgclock.scale,0.5,{x:1,ease:Back.easeOut});
						TweenMax.to(clockText.scale,0.5,{x:1,ease:Back.easeOut});
						
			}
			
			if(coins > 3){
				clearInterval(timerCount);
			}
			
		}		
		
		
        function newPizza(){
			
			TweenMax.fromTo(yogotar1,1,{x:yogotar1.x},{x:yogotar1.x + game.width,onComplete:newYogotar});
			if(coins >= 3){
				timer = 11;
				clearInterval(timerCount);
				//timerCount = setInterval(timerFunction, 1000);
                
                var waitTime = 0
				if(coins>3){
				    waitTime = 800
				}
				game.time.events.add(waitTime,function(){
				    timerCount = setInterval(timerFunction, 1000);
				})
			}
            
			
            
			
			function newYogotar(){
				timbre_iddle.inputEnabled = true;
				shuffle(fractions);
				console.log(fractions)
				shuffle(characters);
				count = 0;
				for(i=0;i<=numPizzas-1;i++){
					fractionPizza[i].blendMode = 3;
					graphics[i].inputEnabled = true;
					fractionPizza[i].over = false;
				}
				textGlobe.setText(fractions[0].fraction);
				TweenMax.fromTo(yogotar1,1,{x:-300},{x:yogotar1.posx});
				yogotar1.setSkinByName(characters[0]);
				yogotar1.setAnimationByName(0, "IDLE", true);
				sound.play("combo");
			}

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
        
        
        if(startGame){
            epicparticles.update()
            
        }

	}
    
    function createCircleSprite(posX,posY,diameter,params){
        params = params || {}
        var isCollision = params.isCollision
        var anchorX = params.anchorX || 0.5
        var anchorY = params.anchorY || 0.5
        var inputCallback = params.inputCallback
        var isColor = params.isColor || "ffffff"
        
        var turnToSprite=game.add.sprite(posX,posY)
        var circle = game.add.graphics(turnToSprite.centerX/200-3, turnToSprite.centerY/200-3);
        turnToSprite.anchor.setTo(anchorX,anchorY)
        turnToSprite.addChild(circle)   
        //Agregar linea para fisicas : game.physics.startSystem(Phaser.Physics.ARCADE);
        circle.beginFill("0x"+isColor, 1);
        circle.drawCircle(0, 0, diameter);
        
        if(isCollision){
            game.physics.enable(turnToSprite, Phaser.Physics.ARCADE);
        }
        if(typeof inputCallback === "function"){
            turnToSprite.inputEnabled=true
            turnToSprite.events.onInputDown.add(inputCallback, this);
        }
        return(turnToSprite)
    }
    
    function inputs(obj){
        
        //Listo para programar
        console.log("Tell me to do something")
        emitter = epicparticles.newEmitter("pickedEnergy")
        emitter.duration=0.05;
        emitter.x = game.world.centerX
        emitter.y = game.world.centerY
        Coin(obj,pointsBar,10)
    }
    
    function reset(){
            
            
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
        particle.makeParticles('atlas.base',key);
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

				particle.makeParticles('atlas.base',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.base','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.base','smoke');
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
		name: "pizzaFraction",
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
            baseSong = sound.play("acornSong", {loop:true, volume:0.6})
                        			
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
            
            initialize()
            
			            
			createPointsBar()
			createHearts()
            createTutorial()
			
			buttons.getButton(baseSong,sceneGroup)
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()