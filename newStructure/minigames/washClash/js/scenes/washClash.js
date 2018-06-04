
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var tutorialPath = "../../shared/minigames/"
var washClash = function(){
    
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
    

	assets = {
        atlases: [
            {   
                name: "atlas.wash",
                json: "images/wash/atlas.json",
                image: "images/wash/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/wash/timeAtlas.json",
                image: "images/wash/timeAtlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [
            
            {
				name:'tutorial_image',
				file:"images/wash/tutorial_image_%input.png"
			},
			{
				name:'BG_TILE',
				file:"images/wash/BG_TILE.png"
			}

		],
        spines: [
			{
				name:"soap",
				file:"images/Spine/Soap/soap.json"
			},
			{
				name:"bug",
				file:"images/Spine/Bacteria/bacteria.json"
			},
			{
				name:"bugs",
				file:"images/Spine/MultiBacteria/multi_bacteria.json"
			},
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
                name:"manita",
                file:"images/Spine/manita/manita.png",
                width:115,
                height:111,
                frames:5
            },
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
            {	name: "ship",
				file: soundsPath + "robotBeep.mp3"},
            {   name:"acornSong",
				file: soundsPath + 'songs/childrenbit.mp3'}
			
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
	var particlesGroup, particlesUsed
    var gameIndex = 215
    var tutoGroup
	var indexGame
    var overlayGroup
    var baseSong
	var speed;
	var holding=false;
	var actualSoap;
	var isColliding=false;
	var soap=[];
	var happySoaps,happyEnemys;
	var enemyP1=[];
	var enemyP2=[];
	var enemyP3=[];
    var count=0;
    var backgroundGroup=null
    var soapGroup=null;
    var enemysGroup=null;
	var coinGroup=null;
	var checkEval=false;
    var tweenTiempo
    var clock, timeBar
    var emitter
	var level=0;
	var reachedMax=false;
	var dificulty=0.3;
	var tutorial=false;
	var dificultyLevels=[
		{"enemys":1,"type":"normal"},
		{"enemys":2,"type":"normal"},
		{"enemys":1,"type":"stronger"},
		{"enemys":2,"type":"stronger"},
		{"enemys":3,"type":"stronger"},
		{"enemys":1,"type":"bigger"},
		{"enemys":2,"type":"stronger"},
		{"enemys":3,"type":"stronger"},
		{"enemys":2,"type":"bigger"},
		{"enemys":3,"type":"stronger"},
		{"enemys":3,"type":"normal"},
		{"enemys":1,"type":"stronger"},
		{"enemys":2,"type":"stronger"},
		{"enemys":3,"type":"stronger"},
		{"enemys":1,"type":"bigger"},
		{"enemys":2,"type":"bigger"},
		{"enemys":3,"type":"bigger"},
		{"enemys":2,"type":"stronger"},
		{"enemys":3,"type":"normal"},
		{"enemys":3,"type":"bigger"}
	];
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){
          
        game.stage.backgroundColor = "#000000"
        lives = 3;
		level=0;
		dificulty=0.3;
		reachedMax=false;
		isColliding=false;
		actualSoap="";
        emitter=""
		holding=false;
		checkEval=false;
        loadSounds()
		speed=350
		tutorial=false;
	}

    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
		//nextLevelAndDificulty(level)
		actualSoap=soap[0]
		tutoLevel()
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
    
	
	
	function tutoLevel(){
		
		var EneposX=game.world.width-100;
		var EneposY=game.world.height-200;
		var enemyType1=0;
		var enemyType2=0;
		var enemyType3=0;
		
		soap[0]=creadorDeJabones(null,-100,-100,0,0.7);
		soap[0].body.x=game.world.centerX;
		soap[0].body.y=180;
		checkEval=false;
		for(var createEnemys=0; createEnemys<dificultyLevels[level].enemys; createEnemys++){
			if(dificultyLevels[level].type=="normal"){
				enemyP1[createEnemys]=creadorDeEnemigos(null,1,EneposX,EneposY,enemyType1,0.4);
				EneposX=EneposX-100;
				enemyType1++;
			}
		}
		
		
		soap[0].body.velocity.x=0;
		soap[0].body.velocity.y=0;
		
		hand=game.add.sprite(100,100,"manita")
        hand.anchor.setTo(0.5)
        hand.scale.setTo(0.5)
		hand.alpha=1;
        hand.animations.add('handy');
		hand.x=soap[0].body.x;
		hand.y=soap[0].body.y;
		hand.play("handy",12,true); 
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.wash','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.wash','life_box')

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
	
		
	function growSoap(obj){
		tutorial=true;
		if(tutorial){
			hand.alpha=0;
			startMoving(enemyP1[0]);
		}
		holding=true;
		actualSoap=obj.spine;
		actualSoap.setAnimationByName(0, "washing", false);
	}
	function stopGrow(obj){
		holding=false;
		actualSoap.setAnimationByName(0, "idle", true);
	}

	function createBackground(){
        
		backgroundGroup = game.add.group()
		sceneGroup.add(backgroundGroup)
		
		soapGroup = game.add.group()
       	sceneGroup.add(soapGroup)
		
		enemysGroup = game.add.group()
       	sceneGroup.add(enemysGroup)
		
		coinGroup= game.add.group()
		sceneGroup.add(coinGroup)
		
		
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
		
		
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.restitution = 0.95;
        
		backAnimated=game.add.tileSprite(0,0,game.world.width,game.world.height,"BG_TILE");
		backgroundGroup.add(backAnimated);
		
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
		coinGroup.add(coins);
        coins.animations.play('coin', 24, true);
        coins.alpha=0;
		
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xffffff)
        rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect.alpha = 0
		rect.inputEnabled=true;
        rect.endFill()
		rect.events.onInputDown.add(growAnywhere);
        rect.events.onInputUp.add(stopAnywhere);
		backgroundGroup.add(rect)
		
		var wall1 = new Phaser.Graphics(game)
        wall1.beginFill(0x000000)
        wall1.drawRect(0,0,game.world.width*2,200)
        wall1.alpha = 0
		wall1.inputEnabled=true;
        wall1.endFill()
		game.physics.p2.enable(wall1,false);
		wall1.body.kinematic = true;
		backgroundGroup.add(wall1)
		
		var wall2 = new Phaser.Graphics(game)
        wall2.beginFill(0x000000)
        wall2.drawRect(0,0,50,game.world.height*2)
        wall2.alpha = 0
		wall2.inputEnabled=true;
        wall2.endFill()
		game.physics.p2.enable(wall2,false);
		wall2.body.kinematic = true;
		backgroundGroup.add(wall2)
		
		var wall3 = new Phaser.Graphics(game)
        wall3.beginFill(0x000000)
        wall3.drawRect(0,0,50,game.world.height*2)
		wall3.x=game.world.width;
        wall3.alpha = 0
		wall3.inputEnabled=true;
        wall3.endFill()
		game.physics.p2.enable(wall3,false);
		wall3.body.kinematic = true;
		backgroundGroup.add(wall3)
		
		var wall4 = new Phaser.Graphics(game)
        wall4.beginFill(0x000000)
        wall4.drawRect(0,0,game.world.width*2,200)
        wall4.alpha = 0
		wall4.y=game.world.height;
		wall4.inputEnabled=true;
        wall4.endFill()
		game.physics.p2.enable(wall4,false);
		wall4.body.kinematic = true;
		backgroundGroup.add(wall4)
		
		happySoaps=game.add.sprite(100,200,"atlas.wash","SOAP");
		happySoaps.alpha=0;
		happySoaps.anchor.setTo(0.5,0.5);
		happySoaps.scale.setTo(0.5,0.5);
		happySoaps.spine=game.add.spine(-100, game.world.height/2, 'soap');
		happySoaps.spine.setAnimationByName(0, "idle", true);
        happySoaps.spine.setSkinByName("normal");
		happySoaps.spine.scale.setTo(0.8,0.8);
		happySoaps.spine2=game.add.spine(happySoaps.spine.x-150, game.world.height/2, 'soap');
		happySoaps.spine2.setAnimationByName(0, "idle", true);
        happySoaps.spine2.setSkinByName("normal");
		happySoaps.spine2.scale.setTo(0.8,0.8);
		happySoaps.spine3=game.add.spine(happySoaps.spine2.x-150, game.world.height/2, 'soap');
		happySoaps.spine3.setAnimationByName(0, "idle", true);
        happySoaps.spine3.setSkinByName("normal");
		happySoaps.spine3.scale.setTo(0.8,0.8);
		
		happyEnemys=game.add.sprite(100,200,"atlas.wash","SOAP");
		happyEnemys.alpha=0;
		happyEnemys.anchor.setTo(0.5,0.5);
		happyEnemys.scale.setTo(0.5,0.5);
		happyEnemys.spine=game.add.spine(game.world.width+100, game.world.height/2, 'bug');
		happyEnemys.spine.setAnimationByName(0, "idle", true);
        happyEnemys.spine.setSkinByName("bacteria 1");
		happyEnemys.spine.scale.setTo(0.5,0.5);
		happyEnemys.spine2=game.add.spine(happyEnemys.spine.x+150, game.world.height/2, 'bug');
		happyEnemys.spine2.setAnimationByName(0, "idle", true);
        happyEnemys.spine2.setSkinByName("bacteria 2");
		happyEnemys.spine2.scale.setTo(0.5,0.5);
		happyEnemys.spine3=game.add.spine(happyEnemys.spine2.x+150, game.world.height/2, 'bugs');
		happyEnemys.spine3.setAnimationByName(0, "idle", true);
        happyEnemys.spine3.setSkinByName("normal");
		happyEnemys.spine3.scale.setTo(0.5,0.5);
		soapGroup.add(happySoaps.spine);
		soapGroup.add(happySoaps.spine2);
		soapGroup.add(happySoaps.spine3);
		enemysGroup.add(happyEnemys.spine);
		enemysGroup.add(happyEnemys.spine2);
		enemysGroup.add(happyEnemys.spine3);
		
		
    }
	
	
	
	function growAnywhere(){
		if(actualSoap){
			holding=true;
			actualSoap.setAnimationByName(0, "washing", true);
		}
	}
	function stopAnywhere(){
		if(actualSoap){
			holding=false;
			actualSoap.setAnimationByName(0, "idle", true);
		}
	}
	
	function creadorDeJabones(obj,posX,posY,index,scaleS){
		
		obj=game.add.sprite(0,0,"atlas.wash","SOAP");
		obj.alpha=0;
		obj.spine=game.add.spine(posX, posY, 'soap');
        obj.spine.setAnimationByName(0, "idle", true);
        obj.spine.setSkinByName("normal");
		obj.sprite=game.add.sprite(0,0,"atlas.wash","SOAP");
		obj.spine.scale.setTo(scaleS);
		obj.anchor.setTo(0.5,0.5);
		obj.x=posX;
		obj.y=posY;
		obj.inputEnabled=true;
		obj.visible=true;
		obj.sprite.visible=false;
		obj.id=index;
		obj.events.onInputDown.add(growSoap,this);
        obj.events.onInputUp.add(stopGrow,this);
		obj.tag="soap";
		game.physics.p2.enable(obj,false);
		obj.body.mass = 0.001;
		obj.body.damping = 0;
		obj.body.x=posX;
		obj.body.y=posY;
		obj.body.setCircle(
			obj.spine.scale.x*90,
			(-obj.spine.scale.x*90 + 0.53 * obj.spine.width  / obj.spine.scale.x),
			(-obj.spine.scale.x*90 + 0.45 * obj.spine.height / obj.spine.scale.y)
		);
		soapGroup.add(obj);
		return obj;
	}
	
	function creadorDeEnemigos(obj,type,posX,posY,ind,scaleB){
		
		obj=game.add.sprite(0,0,"atlas.wash","BACTERIA1");
		obj.anchor.setTo(0.5,0.5);
		obj.alpha=0;
		obj.x=posX;
		obj.y=posY;
		obj.identifier=ind;
		obj.visible=false;
		if(type!=3){
			obj.spine=game.add.spine(obj.x, obj.y, 'bug');
		}else{
			obj.spine=game.add.spine(obj.x, obj.y, 'bugs');
		}
        obj.spine.setAnimationByName(0, "idle", true);
		obj.spine.scale.setTo(scaleB)
		if(type==1){
        	obj.spine.setSkinByName("bacteria 1");
			obj.id=type;
		}else if(type==2){
			obj.spine.setSkinByName("bacteria 2");
			obj.id=type;
		}else if(type==3){
			obj.spine.setSkinByName("normal");
			obj.id=type;
			obj.count=0;
		}
		obj.tag="bug";
		game.physics.p2.enable(obj,false);
		obj.body.x=posX;
		obj.body.y=posY;
		obj.body.mass = 0.001;
		obj.body.damping = 0;
		obj.body.setCircle(
			obj.spine.scale.x*90,
			(-obj.spine.scale.x*90 + 0.2 * obj.spine.width  / obj.spine.scale.x),
			(-obj.spine.scale.x*90 + 0.1 * obj.spine.height / obj.spine.scale.y)
		);
		enemysGroup.add(obj);
		return obj;
	}
	
	function startMoving(obj){
		obj.body.velocity.x = speed*(Math.cos(0));
		obj.body.velocity.y = speed*(Math.sin(2));
	}

    function Coin(objectBorn,objectDestiny,time){
        
        
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
                addPoint(4)
            })
        })
    }
  
    
	function update(){
        
        
		backAnimated.tilePosition.x+=0.2;
		backAnimated.tilePosition.y-=0.2;
		
        if(startGame){
            epicparticles.update()
        }
		
		if(holding && actualSoap.scale.x<2.0){
			actualSoap.scale.setTo(actualSoap.scale.x+0.02,actualSoap.scale.y+0.02)
		}else{
			holding=false;
		}
		for(var existingSoaps=0; existingSoaps<soap.length; existingSoaps++){
			if(soap[existingSoaps]){
				soap[existingSoaps].spine.x=soap[existingSoaps].x;
				soap[existingSoaps].spine.y=soap[existingSoaps].y;
				soap[existingSoaps].spine.angle=soap[existingSoaps].angle;
				if(soap[existingSoaps].body.velocity.x<50 && soap[existingSoaps].body.velocity.x>-50){
					if(tutorial){
						startMoving(soap[existingSoaps])
					}
				}
				soap[existingSoaps].body.setCircle(
					soap[existingSoaps].spine.scale.x*90
				);
			}
		}
		for(var existingEnemysType1=0; existingEnemysType1<enemyP1.length; existingEnemysType1++){
			if(enemyP1[existingEnemysType1]){
				enemyP1[existingEnemysType1].spine.x=enemyP1[existingEnemysType1].x;
				enemyP1[existingEnemysType1].spine.y=enemyP1[existingEnemysType1].y;
				enemyP1[existingEnemysType1].spine.angle=enemyP1[existingEnemysType1].angle;
				enemyP1[existingEnemysType1].body.setCircle(
					enemyP1[existingEnemysType1].spine.scale.x*90
				);
			}
		}
		for(var existingEnemysType2=0; existingEnemysType2<enemyP2.length; existingEnemysType2++){
			if(enemyP2[existingEnemysType2]){
				enemyP2[existingEnemysType2].spine.x=enemyP2[existingEnemysType2].x;
				enemyP2[existingEnemysType2].spine.y=enemyP2[existingEnemysType2].y;
				enemyP2[existingEnemysType2].spine.angle=enemyP2[existingEnemysType2].angle;
				enemyP2[existingEnemysType2].body.setCircle(
					enemyP2[existingEnemysType2].spine.scale.x*90
				);
			}
		}
		for(var existingEnemysType3=0; existingEnemysType3<enemyP3.length; existingEnemysType3++){
			if(enemyP3[existingEnemysType3]){
				enemyP3[existingEnemysType3].spine.x=enemyP3[existingEnemysType3].x;
				enemyP3[existingEnemysType3].spine.y=enemyP3[existingEnemysType3].y;
				enemyP3[existingEnemysType3].spine.angle=enemyP3[existingEnemysType3].angle;
				if(enemyP3[existingEnemysType3].count==200){
					enemyP3[existingEnemysType3].spine.scale.setTo(enemyP3[existingEnemysType3].spine.scale.x+0.1,enemyP3[existingEnemysType3].spine.scale.y+0.1);
					enemyP3[existingEnemysType3].count=0;
				}
				enemyP3[existingEnemysType3].body.setCircle(
						enemyP3[existingEnemysType3].spine.scale.x*90
					);
				enemyP3[existingEnemysType3].count++;
			}	
		}
		for(var collideP1=0; collideP1<enemyP1.length; collideP1++){
			if(enemyP1[collideP1] && !isColliding && lives>0){
				enemyP1[collideP1].body.onBeginContact.add(hitSoap.bind(this,enemyP1[collideP1]));
			}
		}
		for(var collideP2=0; collideP2<enemyP2.length; collideP2++){
			if(enemyP2[collideP2] && !isColliding && lives>0){
				enemyP2[collideP2].body.onBeginContact.add(hitSoap.bind(this,enemyP2[collideP2]));
			}
		}
		for(var collideP3=0; collideP3<enemyP3.length; collideP3++){
			if(enemyP3[collideP3] && !isColliding && lives>0){
				enemyP3[collideP3].body.onBeginContact.add(hitSoap.bind(this,enemyP3[collideP3]));
			}
		}
		
	}
	function hitSoap(bodyB, bodyS){
		
		if(bodyB && bodyS && !isColliding){
			var obj1=bodyB;
			var obj2=bodyS.sprite;
			var newSoap=0;
			var newEnemy=0;
			var idSoap;
			var idEnemy;
			if(obj2.tag=="soap" && obj1.tag=="bug"){
				obj2.spine.setAnimationByName(0, "hit", false);
				obj1.spine.setAnimationByName(0, "hit", false);
				isColliding=true;
			}
			
			//choque baja escala a jabon si no esta creciendo
			if(obj2.tag=="soap" && obj1.tag=="bug" && !holding){				
					obj1.spine.scale.setTo(obj1.spine.scale.x-0.1,obj1.spine.scale.y-0.1);
					obj2.spine.scale.setTo(obj2.spine.scale.x-dificulty,obj2.spine.scale.y-dificulty);
			}
			//choque baja escala a jabon si esta creciendo
			if(obj2.tag=="soap" && obj1.tag=="bug" && holding){
				obj2.spine.scale.setTo(obj2.spine.scale.x-(dificulty+0.2),obj2.spine.scale.y-(dificulty+0.2));
				holding=false;
				obj2.spine.setAnimationByName(0, "idle", true);
			}
			
			
			//choque cambia bacteria a jabon
			if(obj2.tag=="soap" && obj1.tag=="bug" && obj1.spine.scale.x<0.3){
				if(obj1.id==1){
					newSoap=soap.push()
					idEnemy=obj1.identifier;
					enemyP1[obj1.identifier].body.data.shapes[0].sensor=true;
					soap[newSoap]=creadorDeJabones(null,obj1.x,obj1.y,newSoap,0.5);
					enemyP1[obj1.identifier].destroy();
					enemyP1[obj1.identifier].spine.destroy();
					enemyP1.splice(obj1.identifier,1);
					for(var clean=0; clean<enemyP1.length; clean++){
						enemyP1[clean].identifier=clean;
					}
				}else if(obj1.id==2){
					newSoap=soap.push()
					idEnemy=obj1.identifier;
					enemyP2[obj1.identifier].body.data.shapes[0].sensor=true;
					soap[newSoap]=creadorDeJabones(null,obj1.x,obj1.y,newSoap,0.5);
					enemyP2[obj1.identifier].destroy();
					enemyP2[obj1.identifier].spine.destroy();
					enemyP2.splice(obj1.identifier,1);	
					for(var clean=0; clean<enemyP2.length; clean++){
						enemyP2[clean].identifier=clean;
					}
				}else if(obj1.id==3){
					newSoap=soap.push()
					idEnemy=obj1.identifier;
					enemyP3[obj1.identifier].body.data.shapes[0].sensor=true;
					soap[newSoap]=creadorDeJabones(null,obj1.x,obj1.y,newSoap,0.5);
					enemyP3[obj1.identifier].destroy();
					enemyP3[obj1.identifier].spine.destroy();
					enemyP3.splice(obj1.identifier,1);
					for(var clean=0; clean<enemyP3.length; clean++){
						enemyP3[clean].identifier=clean;
					}
				}
				startMoving(soap[newSoap])
				
				//Coin(obj2,pointsBar,10);
			}
			//choque cambia jabon a bacteria
			
			if(obj2.tag=="soap" && obj1.tag=="bug" && obj2.spine.scale.x<0.3){
				if(obj1.id==1){
					newEnemy=enemyP1.push()
					soap[obj2.id].body.data.shapes[0].sensor=true;
					enemyP1[newEnemy]=creadorDeEnemigos(null,1,obj2.x,obj2.y,newEnemy,0.3);
					soap[obj2.id].destroy();
					soap[obj2.id].spine.destroy();
					soap.splice(obj2.id,1);
					startMoving(enemyP1[newEnemy])
				}else if(obj1.id==2){
					newEnemy=enemyP2.push()
					soap[obj2.id].body.data.shapes[0].sensor=true;
					enemyP2[newEnemy]=creadorDeEnemigos(null,2,obj2.x,obj2.y,newEnemy,0.3);
					soap[obj2.id].destroy();
					soap[obj2.id].spine.destroy();
					soap.splice(obj2.id,1);
					startMoving(enemyP2[newEnemy])
				}else if(obj1.id==3){
					newEnemy=enemyP3.push()
					soap[obj2.id].body.data.shapes[0].sensor=true;
					enemyP3[newEnemy]=creadorDeEnemigos(null,3,obj2.x,obj2.y,newEnemy,0.3);
					soap[obj2.id].destroy();
					soap[obj2.id].spine.destroy();
					soap.splice(obj2.id,1);
					startMoving(enemyP3[newEnemy])
				}
				for(var clean=obj2.id; clean<soap.length; clean++){
					soap[clean].id=clean;
				}
			}
			
			if(enemyP1.length==0 && enemyP2.length==0 && enemyP3.length==0 && !checkEval){
				checkEval=true;
				game.time.events.add(900, function(){
					for(var destroySoaps=0; destroySoaps<soap.length; destroySoaps++){
						soap[destroySoaps].body.data.shapes[0].sensor=true;
						soap[destroySoaps].destroy();
						soap[destroySoaps].spine.destroy();
					}
					for(var destroyBugs=0; destroyBugs<enemyP1.length; destroyBugs++){
						enemyP1[destroyBugs].body.data.shapes[0].sensor=true;
						enemyP1[destroyBugs].destroy();
						enemyP1[destroyBugs].spine.destroy();
					}
					for(var destroyBugs=0; destroyBugs<enemyP2.length; destroyBugs++){
						enemyP2[destroyBugs].body.data.shapes[0].sensor=true;
						enemyP2[destroyBugs].destroy();
						enemyP2[destroyBugs].spine.destroy();
					}
					for(var destroyBugs=0; destroyBugs<enemyP3.length; destroyBugs++){
						enemyP3[destroyBugs].body.data.shapes[0].sensor=true;
						enemyP3[destroyBugs].destroy();
						enemyP3[destroyBugs].spine.destroy();
					}
					soap.splice(0);
					enemyP1.splice(0);
					enemyP2.splice(0);
					enemyP3.splice(0);
					reset(1);
				});
			}else if(soap.length==0 && !checkEval){
				checkEval=true;
				game.time.events.add(900, function(){
					for(var destroySoaps=0; destroySoaps<soap.length; destroySoaps++){
						soap[destroySoaps].body.data.shapes[0].sensor=true;
						soap[destroySoaps].destroy();
						soap[destroySoaps].spine.destroy();
					}
					for(var destroyBugs=0; destroyBugs<enemyP1.length; destroyBugs++){
						enemyP1[destroyBugs].body.data.shapes[0].sensor=true;
						enemyP1[destroyBugs].destroy();
						enemyP1[destroyBugs].spine.destroy();
					}
					for(var destroyBugs2=0; destroyBugs2<enemyP2.length; destroyBugs2++){
						enemyP2[destroyBugs2].body.data.shapes[0].sensor=true;
						enemyP2[destroyBugs2].destroy();
						enemyP2[destroyBugs2].spine.destroy();
					}
					for(var destroyBugs3=0; destroyBugs3<enemyP3.length; destroyBugs3++){
						enemyP3[destroyBugs3].body.data.shapes[0].sensor=true;
						enemyP3[destroyBugs3].destroy();
						enemyP3[destroyBugs3].spine.destroy();
					}
					soap.splice(0);
					enemyP1.splice(0);
					enemyP2.splice(0);
					enemyP3.splice(0);
					reset(2);
				});
			}
			game.time.events.add(120, function(){
				isColliding = false;
				if(obj2.tag=="soap" && obj1.tag=="bug"){
					obj2.spine.setAnimationByName(0, "idle", true);
					obj1.spine.setAnimationByName(1, "idle", true);
				}
			});
		}
	}
    function reset(whoWin){
		if(whoWin==1){
			
			game.add.tween(happySoaps.spine3).to({x:game.world.centerX-150,y:game.world.height/2},750,Phaser.Easing.linearIn,true)
			game.add.tween(happySoaps.spine2).to({x:game.world.centerX,y:game.world.height/2},750,Phaser.Easing.linearIn,true);
			game.add.tween(happySoaps.spine).to({x:game.world.centerX+150,y:game.world.height/2},750,Phaser.Easing.linearIn,true).onComplete.add(function(){
				game.add.tween(happySoaps.spine3).to({y:game.world.height/2-50},350,Phaser.Easing.linear,true).yoyo(true);
				game.add.tween(happySoaps.spine2).to({y:game.world.height/2-50},350,Phaser.Easing.linear,true).yoyo(true);
				game.add.tween(happySoaps.spine).to({y:game.world.height/2-50},350,Phaser.Easing.linear,true).yoyo(true);
				Coin(game.world,pointsBar,10)
				game.add.tween(happySoaps.spine3).to({x:game.world.width+200,y:game.world.height/2},1050,Phaser.Easing.linearIn,true,1000)
				game.add.tween(happySoaps.spine2).to({x:game.world.width+350,y:game.world.height/2},1050,Phaser.Easing.linearIn,true,1000);
				game.add.tween(happySoaps.spine).to({x:game.world.width+500,y:game.world.height/2},1050,Phaser.Easing.linearIn,true,1000).onComplete.add(function(){
					happySoaps.spine.x=-100;
					happySoaps.spine2.x=happySoaps.spine.x-150;
					happySoaps.spine3.x=happySoaps.spine2.x-150;
					if(level<19){
						level++;
					}else{
						level=0;
						dificulty+=0.1;
						reachedMax=true;
					}
					if(reachedMax){
						level=game.rnd.integerInRange(0,8);
					}
					nextLevelAndDificulty(level);
				});
			});
		}else if(whoWin==2){
			
			game.add.tween(happyEnemys.spine3).to({x:game.world.centerX+180,y:game.world.height/2},750,Phaser.Easing.linearIn,true)
			game.add.tween(happyEnemys.spine2).to({x:game.world.centerX+10,y:game.world.height/2},750,Phaser.Easing.linearIn,true);
			game.add.tween(happyEnemys.spine).to({x:game.world.centerX-160,y:game.world.height/2},750,Phaser.Easing.linearIn,true).onComplete.add(function(){
				missPoint();
				game.add.tween(happyEnemys.spine3).to({y:game.world.height/2-50},450,Phaser.Easing.linearOut,true).yoyo(true);
				game.add.tween(happyEnemys.spine2).to({y:game.world.height/2-50},450,Phaser.Easing.linearOut,true).yoyo(true);
				game.add.tween(happyEnemys.spine).to({y:game.world.height/2-50},450,Phaser.Easing.linearOut,true).yoyo(true);
				game.add.tween(happyEnemys.spine3).to({x:-200,y:game.world.height/2},1050,Phaser.Easing.linearIn,true,1000)
				game.add.tween(happyEnemys.spine2).to({x:-350,y:game.world.height/2},1050,Phaser.Easing.linearIn,true,1000);
				game.add.tween(happyEnemys.spine).to({x:-500,y:game.world.height/2},1050,Phaser.Easing.linearIn,true,1000).onComplete.add(function(){
					happyEnemys.spine.x=game.world.width+100;
					happyEnemys.spine2.x=happyEnemys.spine.x+150;
					happyEnemys.spine3.x=happyEnemys.spine2.x+150;
					nextLevelAndDificulty(level);
				});
			});
		}
    }
	function nextLevelAndDificulty(level){
		var EneposX=game.world.width-100;
		var EneposY=game.world.height-200;
		var enemyType1=0;
		var enemyType2=0;
		var enemyType3=0;
		
		soap[0]=creadorDeJabones(null,-100,-100,0,0.7);
		soap[0].body.x=game.world.centerX;
		soap[0].body.y=180;
		startMoving(soap[0]);
		checkEval=false;
		for(var createEnemys=0; createEnemys<dificultyLevels[level].enemys; createEnemys++){
			if(dificultyLevels[level].type=="normal"){
				enemyP1[createEnemys]=creadorDeEnemigos(null,1,EneposX,EneposY,enemyType1,0.4);
				EneposX=EneposX-100;
				enemyType1++;
				startMoving(enemyP1[createEnemys]);
			}else if(dificultyLevels[level].type=="stronger"){
				enemyP2[createEnemys]=creadorDeEnemigos(null,2,EneposX,EneposY,enemyType2,0.4);
				EneposX=EneposX-100;
				enemyType2++;
				startMoving(enemyP2[createEnemys]);
			}else if(dificultyLevels[level].type=="bigger"){
				enemyP3[createEnemys]=creadorDeEnemigos(null,3,EneposX,EneposY,enemyType3,0.4);
				EneposX=EneposX-100;
				enemyType3++;
				startMoving(enemyP3[createEnemys]);
			}
		}
		
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
        particle.makeParticles('atlas.wash',key);
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

				particle.makeParticles('atlas.wash',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.wash','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.wash','smoke');
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
		name: "washClash",
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