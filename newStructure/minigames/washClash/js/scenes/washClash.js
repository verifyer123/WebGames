
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
			},

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
            }
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
    var gameIndex = 1
    var tutoGroup
	var level=1;
	var num=0;
	var counterActualLevel=0;
	var actualObj
	var indexGame
	var soapProxy
	var bacteriasToCreate;
	var holding=false;
	var moveAll=false;
	var passingLevel=false;
    var overlayGroup
    var baseSong
	var bacteriasProxy=new Array();
	var positionsX=new Array();
	var positionsY=new Array();
	var skins=new Array();
	var isColliding=false;
    
    var backgroundGroup=null;
	var soapGroup=null;
	var bacteriasGroup=null;
    
    var tweenTiempo
    var clock, timeBar
    var emitter

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){
          
        game.stage.backgroundColor = "#000000"
        lives = 3
		level=1;
		num=0;
		counterActualLevel=0
        emitter=""
		holding=false;
		actualObj=null
		moveAll=false;
		skins[0]="BACTERIA1";
		skins[1]="BACTERIA2";
		skins[2]="BACTERIA3";
        loadSounds();
	}

    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
		bounceAndMoveAll(soapProxy);
		moveAll=true;
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

	function bounceAndMoveAll(obj){
		obj.body.moveForward(800)
		obj.body.moveLeft(100)
		obj.body.collideWorldBounds = true;
	}
	
	
	function createBackground(){
        
	   backgroundGroup = game.add.group();
       sceneGroup.add(backgroundGroup);
		
		bacteriasGroup= game.add.group();
		sceneGroup.add(bacteriasGroup);
		
		soapGroup=game.add.group();
		sceneGroup.add(soapGroup);
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
       	
        tileBack=game.add.tileSprite(0,0,game.world.width,game.world.height,"BG_TILE");
		backgroundGroup.add(tileBack);
        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
		
		positionsX[0]=100;
		positionsX[1]=game.world.centerX;	
		positionsX[2]=game.world.width-100;
		
		positionsY[0]=200;
		positionsY[1]=game.world.height-100;
		
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.restitution = 1;
		
		
		//create Soap
		
		soapProxy=game.add.sprite(positionsX[0],positionsY[0],"atlas.wash","SOAP");
		soapProxy.scale.setTo(0.7,0.7);
		soapProxy.anchor.setTo(0.5,0.5);
		soapProxy.tag="soap";
		soapProxy.inputEnabled=true;
		soapProxy.alpha=0;
		soapGroup.add(soapProxy);
		
		
		soap = game.add.spine(game.world.centerX, game.world.centerY, 'soap')
        soap.scale.setTo(0.7)
        soap.setAnimationByName(0, "idle", true)
        soap.setSkinByName("normal")
		soapGroup.add(soap);
		
		
		bacterium1 = game.add.spine(0,0, 'bug')
        bacterium1.scale.setTo(0.5)
		bacterium1.alpha=0;
        bacterium1.setAnimationByName(0, "idle", true)
        bacterium1.setSkinByName("bacteria 1")
		soapGroup.add(bacterium1);
		
		bacterium2 = game.add.spine(0,0, 'bug')
        bacterium2.scale.setTo(0.5)
		bacterium2.alpha=0;
        bacterium2.setAnimationByName(0, "idle", true)
        bacterium2.setSkinByName("bacteria 2")
		soapGroup.add(bacterium2);
		
		bacterium3 = game.add.spine(0,0, 'bugs')
        bacterium3.scale.setTo(0.5)
		bacterium3.alpha=0;
        bacterium3.setAnimationByName(0, "idle", true)
        bacterium3.setSkinByName("normal")
		soapGroup.add(bacterium3);
		
		soapProxy.events.onInputDown.add(biggerSoap,{spine: soap, proxy: soapProxy});
		soapProxy.events.onInputUp.add(stopSoap,{spine: soap, proxy: soapProxy});
		
		game.physics.p2.enable(soapProxy,false);
		soapProxy.body.setCircle(
			soapProxy.scale.x*90,
			(-soapProxy.scale.x*90 + 0.4 * soapProxy.width  / soapProxy.scale.x),
			(-soapProxy.scale.x*90 + 0.3 * soapProxy.height / soapProxy.scale.y)
		);
		
		
		
		for(var init=0; init<3; init++){
			bacteriasProxy[init]=game.add.sprite(-100,-100,"atlas.wash","BACTERIA"+(init+1));
			bacteriasProxy[init].scale.setTo(0.5,0.5);
			bacteriasProxy[init].anchor.setTo(0.5,0.5);
			bacteriasProxy[init].tag="bacteria";
			bacteriasGroup.add(bacteriasProxy[init]);
			bacteriasProxy[init].id=init;
		}
		
		
		

		levels()
		
		
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
  
	function levels(){
		
		
		
		if(level<=2){
			bacteriasToCreate=game.rnd.integerInRange(0,1);
		}else if(level>2){
			bacteriasToCreate=game.rnd.integerInRange(1,2);
		}
		for(var createBacterias=0; createBacterias<bacteriasToCreate+1; createBacterias++){
					for(var createBacteriasPosy=0; createBacteriasPosy<2; createBacteriasPosy++){
						
						if(createBacterias+1!=3){
						
						window['bacterium' + (createBacterias+1)].alpha=1;
						bacteriasProxy[createBacterias].alpha=0;
						bacteriasProxy[createBacterias].anchor.setTo(0.5,0.5);

						game.physics.p2.enable(bacteriasProxy[createBacterias],true);
						bacteriasProxy[createBacterias].body.x=positionsX[createBacterias+1];
						bacteriasProxy[createBacterias].body.y=positionsY[createBacteriasPosy];
						bacteriasProxy[createBacterias].body.setCircle(
							bacteriasProxy[createBacterias].scale.x*120
						);
						bacteriasProxy[createBacterias].inputEnabled=false
						
					}else{
						
						game.physics.p2.enable(bacteriasProxy[createBacterias],true);
						bacteriasProxy[createBacterias].body.x=positionsX[createBacterias+1];
						bacteriasProxy[createBacterias].body.y=positionsY[createBacteriasPosy];
						bacteriasProxy[createBacterias].body.setCircle(
							bacteriasProxy[createBacterias].scale.x*120
						);
						bacteriasProxy[createBacterias].inputEnabled=false;
					}
			}
		}
		//passingLevel=true;
	}
    
	function biggerSoap(obj,obj2){
		if(this.proxy.scale.x<1.5){
			actualObj=this.proxy;
			holding=true;
			this.spine.setAnimationByName(0, "washing", false)
		}
	}

	function stopSoap(obj, obj2){
		holding=false;
		this.spine.setAnimationByName(0, "idle", true)
	}
	function hitSoap(bodyB, bodyS, number){
		
		
		if(bodyB && bodyS && !isColliding){
			
			bodyB.body.moveForward(1000)
			bodyB.body.moveRight(200)
			bodyS.sprite.body.moveForward(1000)
			bodyS.sprite.body.moveRight(200)
			
			isColliding=true;
			
			var changeToSprite=bodyS.sprite
		if((bodyB.tag=="bacteria" && changeToSprite.tag=="soap") || (bodyB.tag=="soap" && changeToSprite.tag=="bacteria")){
			
			
			if(changeToSprite.id!=1 && changeToSprite.id!=2 && changeToSprite.id!=3 && bodyB.id!=1 && bodyB.id!=2 && bodyB.id!=3){
				soap.setAnimationByName(0, "hit", false)

				game.time.events.add(200, function(){
					isColliding = false;
					soap.setAnimationByName(0, "idle", true)
				});
			}else{
				
				if(bodyB.tag=="soap"){
					window['soap' + bodyB.id].setAnimationByName(0, "hit", false)
					game.time.events.add(200, function(){
						isColliding = false;
						window['soap' + bodyB.id].setAnimationByName(0, "idle", true)
					});
				}
			}
			
			
			if(!holding && (bodyB.tag=="bacteria" && changeToSprite.tag=="soap") || (bodyB.tag=="soap" && changeToSprite.tag=="bacteria") ){
				
				if(bodyB.tag=="bacteria"){
					changeToSprite.scale.x-=0.1;
					changeToSprite.scale.y-=0.1;
					changeToSprite.body.setCircle(
						changeToSprite.scale.x*90
					);
				}else if(changeToSprite.tag=="bacteria"){
					bodyB.scale.x-=0.1;
					bodyB.scale.y-=0.1;
					bodyB.body.setCircle(
						bodyB.scale.x*90
					);
				}
			}
			}
			
			if(holding && (bodyB.tag=="bacteria" && changeToSprite.tag=="soap") || (bodyB.tag=="soap" && changeToSprite.tag=="bacteria")){
				
				if(bodyB.tag=="bacteria"){
					changeToSprite.scale.x=0.4;
					changeToSprite.scale.y=0.4;
					changeToSprite.body.setCircle(
						changeToSprite.scale.x*90
					);
				}else if(changeToSprite.tag=="bacteria"){
					bodyB.scale.x=0.4;
					bodyB.scale.y=0.4;
					bodyB.body.setCircle(
						bodyB.scale.x*90
					);
				}
			}
			if(changeToSprite.scale.x>bodyB.scale.x && (bodyB.tag=="bacteria" && changeToSprite.tag=="soap") || (bodyB.tag=="soap" && changeToSprite.tag=="bacteria")){
				if(bodyB.tag=="bacteria"){
					bodyB.scale.x-=0.2;
					bodyB.scale.y-=0.2;
					bodyB.body.setCircle(bodyB.scale.x*120);
				}else if(changeToSprite.tag=="bacteria"){
					changeToSprite.scale.x-=0.2;
					changeToSprite.scale.y-=0.2;
					changeToSprite.body.setCircle(changeToSprite.scale.x*120);
				}
			}else if(changeToSprite.scale.x<bodyB.scale.x && (bodyB.tag=="bacteria" && changeToSprite.tag=="soap") || (bodyB.tag=="soap" && changeToSprite.tag=="bacteria")){
				missPoint();
			}
			if(bodyB.scale.x<=0 && (bodyB.tag=="bacteria" && changeToSprite.tag=="soap") || (bodyB.tag=="soap" && changeToSprite.tag=="bacteria")){
				
				counterActualLevel++
				if(bodyB.tag=="bacteria"){
					Coin(bodyB,pointsBar,50)
					bodyB.anchor.setTo(0.5,0.5)
					bounceAndMoveAll(bodyB)
				}else if(changeToSprite.tag=="bacteria"){
					Coin(changeToSprite,pointsBar,50)
					changeToSprite.anchor.setTo(0.5,0.5)
					bounceAndMoveAll(changeToSprite)	 
				}
				
				if(bodyB.tag=="bacteria"){
					window['soap' + bodyB.id] = game.add.spine(0,0, 'soap')
					window['soap' + bodyB.id].scale.setTo(0.4,0.4)
					window['soap' + bodyB.id].setAnimationByName(0, "idle", true)
					window['soap' + bodyB.id].setSkinByName("normal")
					window['soap' + bodyB.id].alpha=1
					window["bacterium"+(bodyB.id+1)].alpha=0;

					
					bodyB.addChild(window['soap' + bodyB.id])
					soapGroup.add(window['soap' + bodyB.id])
					window['soap' + bodyB.id].x=0;
					window['soap' + bodyB.id].y=0;
				}else if(changeToSprite.tag=="bacteria"){
					
					console.log(changeToSprite.id)
					window['soap' + changeToSprite.id] = game.add.spine(0,0, 'soap')
					window['soap' + changeToSprite.id].scale.setTo(0.4,0.4)
					window['soap' + changeToSprite.id].setAnimationByName(0, "idle", true)
					window['soap' + changeToSprite.id].setSkinByName("normal")
					window['soap' + changeToSprite.id].alpha=1
					window["bacterium"+(changeToSprite.id+1)].alpha=0;
					changeToSprite.addChild(window['soap' + changeToSprite.id])
					soapGroup.add(window['soap' + changeToSprite.id])
					window['soap' + changeToSprite.id].x=0;
					window['soap' + changeToSprite.id].y=0;
				}
				
				
				if(bodyB.tag=="bacteria"){
					bodyB.scale.setTo(0.4,0.4)
					bodyB.tag="soap";
					bodyB.body.setCircle(
						window['soap' + bodyB.id].scale.x*90
					);
					bodyB.inputEnabled=true;
					bodyB.events.onInputDown.add(biggerSoap, {spine: window['soap' + bodyB.id], proxy: bodyB});
					bodyB.events.onInputUp.add(stopSoap, {spine: window['soap' + bodyB.id], proxy: bodyB});
					num++;
				}else if(changeToSprite.tag=="bacteria"){
					changeToSprite.scale.setTo(0.4,0.4)
					changeToSprite.tag="soap";
					changeToSprite.body.setCircle(
						window['soap' + changeToSprite.id].scale.x*90
					);
					changeToSprite.inputEnabled=true;
					console.log(changeToSprite)
					changeToSprite.events.onInputDown.add(biggerSoap, {spine: window['soap' + changeToSprite.id], proxy: changeToSprite});
					changeToSprite.events.onInputUp.add(stopSoap, {spine: window['soap' + changeToSprite.id], proxy: changeToSprite});
					num++;
				}
				
				if(counterActualLevel==bacteriasToCreate+1){
					counterActualLevel=0;
					transition(bodyB);
				}
			}
			
			game.time.events.add(200, function(){
				isColliding = false;
			});
			
		}
		
	}
	
	function update(){
        
        
        if(startGame){
            epicparticles.update()
            
        }
		
		tileBack.tilePosition.x+=0.2;
		tileBack.tilePosition.y-=0.2;
		
			for(var startMovingEnemys=0; startMovingEnemys<bacteriasToCreate+1; startMovingEnemys++){
				if(window["bacterium"+(startMovingEnemys+1)]){
					window["bacterium"+(startMovingEnemys+1)].x=bacteriasProxy[startMovingEnemys].x;
					window["bacterium"+(startMovingEnemys+1)].y=bacteriasProxy[startMovingEnemys].y;
					window["bacterium"+(startMovingEnemys+1)].scale.setTo(bacteriasProxy[startMovingEnemys].scale.x,bacteriasProxy[startMovingEnemys].scale.y);
					window["bacterium"+(startMovingEnemys+1)].angle=bacteriasProxy[startMovingEnemys].angle;
				}
				
		}
		for(var startMovingSoaps1=0; startMovingSoaps1<bacteriasToCreate+1; startMovingSoaps1++){
			if(window["soap"+(startMovingSoaps1)] && bacteriasProxy[startMovingSoaps1].id==startMovingSoaps1){
				window["soap"+(startMovingSoaps1)].x=bacteriasProxy[startMovingSoaps1].x;
				window["soap"+(startMovingSoaps1)].y=bacteriasProxy[startMovingSoaps1].y;
				window["soap"+(startMovingSoaps1)].scale.setTo(bacteriasProxy[startMovingSoaps1].scale.x,bacteriasProxy[startMovingSoaps1].scale.y);
				window["soap"+(startMovingSoaps1)].angle=bacteriasProxy[startMovingSoaps1].angle;
			}
		}
		
		
		if(soap){
			//here goes the spines with the sprites
			soap.x=soapProxy.x;
			soap.y=soapProxy.y;
			soap.scale.setTo(soapProxy.scale.x,soapProxy.scale.y);
			soap.angle=soapProxy.angle;
		}
		if(holding){
			actualObj.scale.x+=0.005;
			actualObj.scale.y+=0.005;
			actualObj.body.setCircle(
				actualObj.scale.x*90
			);
		}
		
		
		
		
		if(moveAll){
			for(var startMovingEnemys=0; startMovingEnemys<bacteriasToCreate+1; startMovingEnemys++){
				bounceAndMoveAll(bacteriasProxy[startMovingEnemys]);
			}
			moveAll=false;
		}
		
		for(var collide=0; collide<bacteriasToCreate+1; collide++){
			if(bacteriasProxy[collide] && !isColliding){
				bacteriasProxy[collide].body.onBeginContact.add(hitSoap.bind(this,bacteriasProxy[collide]));
			}
		}
	}
    
    
    
    function transition(obj){
		foam=game.add.sprite(game.world.centerX,game.world.centerY,"atlas.wash","FOAM");
		foam.alpha=1;
		foam.anchor.setTo(0.5,0.5)
		passingLevel=true;
		
		game.add.tween(foam.scale).to({ x:game.world.width/3,y:game.world.height/3},3050,Phaser.Easing.Cubic.In,true).onComplete.add(function(){
			game.add.tween(foam.scale).to({ x:0,y:0},2350,Phaser.Easing.Cubic.Out,true).onComplete.add(function(){
				bounceAndMoveAll(soapProxy);
			})
			soapProxy.scale.setTo(0.7,0.7);
			soapProxy.body.setCircle(
				soapProxy.scale.x*90
				);
				if(passingLevel){
					for(var checkIfExists=0; checkIfExists<bacteriasProxy.length; checkIfExists++){
							if(bacteriasProxy[checkIfExists].body){
							bacteriasProxy[checkIfExists].body.velocity.x=0;
							bacteriasProxy[checkIfExists].body.velocity.y=0;
							bacteriasProxy[checkIfExists].scale.setTo(0.4,0.4);
							bacteriasProxy[checkIfExists].tag="bacteria";
							bacteriasProxy[checkIfExists].body.x=-200;
							bacteriasProxy[checkIfExists].body.y=-200;
							bacteriasProxy[checkIfExists].body.setCircle(
								bacteriasProxy[checkIfExists].scale.x*120
							);
							window["bacterium"+(checkIfExists+1)].alpha=0
							//
							if(window["soap"+(checkIfExists)]){
								window["soap"+(checkIfExists)].destroy();
							}
						}
					}
				}
				soapProxy.body.x=positionsX[0];
				soapProxy.body.y=positionsY[0];
				soapProxy.body.velocity.x=0;
				soapProxy.body.velocity.y=0;
				level++;
				levels();
				isColliding = false;		
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