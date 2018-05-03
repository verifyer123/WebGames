
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var tutorialPath = "../../shared/minigames/"
var icyRush = function(){
    
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
                name: "atlas.icyRush",
                json: "images/icyRush/atlas.json",
                image: "images/icyRush/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/icyRush/timeAtlas.json",
                image: "images/icyRush/timeAtlas.png",
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
				file:"images/icyRush/tutorial_image_%input.png"
			},
            {
				name:'skyBack',
				file:"images/icyRush/2.png"
			},
            {
				name:'snowflakes',
				file:"images/icyRush/snowflakes.png"
			}

		],
        spines: [
            {
				name:"bear",
				file:"images/Spine/bear/bear.json"
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
    var obstaclesGroup=null
    var wavesGroup=null
    var smogGroup=null
    var gameActive = true
	var startGame=false;
	var particlesGroup, particlesUsed
    var gameIndex = 201
    var mask
    var saveDistance=0;
    var variationX=0;
    var tutoGroup
    var noDistortion=false;
    var max = 0;
    var front_emitter;
    var mid_emitter;
    var back_emitter;
    var update_interval = 4 * 60;
    var i = 0;
    var bearProxy
    var rails1=new Array();
    var rails2=new Array();
    var railsGap1=new Array();
    var railsGap2=new Array();
    var obstaclesLane= new Array();
    var tweenObj= new Array();
    var tweenObjAl= new Array();
    var tweenObjSc= new Array(); 
    var typeOfObstacle= new Array();
    var created= new Array();
    var wichObj
    var speed=2300;
    var roadSpeed=-3;
    var counterFall
    var actualTrail=0;
    var posX1, posX2, posX3;
    var startPosition;
    var nextPieceToPoisition, nextPieceToPoisition2
    var spaceRails;
    var heightRails;
    var inverseGaps, inverseGaps2
    var defaultScale, defaultScale2
	var indexGame
    var overlayGroup
    var baseSong
    var bear
    var keyPressed, keyPressed2
    var backgroundGroup=null
    var tilesGroups=null
    var animalGroup=null

    var tweenTiempo
    var clock, timeBar
    var emitter
    var snow
    var rails=new Array(20);

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){
          
        game.stage.backgroundColor = "#000000"
        lives = 3
        keyPressed=false
        keyPressed2=false
        actualTrail=1;
        variationX=0;
        inverseGaps2=null;
        inverseGaps=null;
        nextPieceToPoisition=0;
        nextPieceToPoisition2=0;
        saveDistance=0;
        typeOfObstacle[0]="rock";
        typeOfObstacle[1]="hole";
        typeOfObstacle[2]="coin";
        wichObj=0;
        emitter=""
        snow=""
        speed=4200;
        roadSpeed=-3;
        counterFall=0;
        posX1=game.world.centerX;
        posX2=game.world.centerX+190;
        posX3=game.world.centerX-190;
        inverseGaps=null
        defaultScale=null
        startPosition=game.world.centerY-195;
        spaceRails=100;
        heightRails=100;
        noDistortion=false;
        loadSounds()
	}

    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
        startSpawn();
        startGame=true;

        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.icyRush','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.icyRush','life_box')

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
        //epicparticles.loadEmitter(game.load, "snow") 
    }
    
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }
    

	function createBackground(){
        
	   backgroundGroup = game.add.group()
       sceneGroup.add(backgroundGroup)
       tilesGroups = game.add.group()
       sceneGroup.add(tilesGroups);
        
        wavesGroup = game.add.group()
       sceneGroup.add(wavesGroup)
        obstaclesGroup = game.add.group()
       sceneGroup.add(obstaclesGroup)
        animalGroup = game.add.group()
       sceneGroup.add(animalGroup)
        smogGroup = game.add.group()
       sceneGroup.add(smogGroup)
        
          
//            snow = epicparticles.newEmitter("snow")
//            snow.x = game.world.centerX
//            snow.y = -100
//            snow.duration=10000;
//            snow.speed=400
//            snow.rotation=0;
//            snow.finishParticleSizeVariance=0;
//            snow.gravityy=-3000
//            snow.maxRadius=300
//            snow.tangentialAccelVariance=1000
//            snow.angle=45
//            snow.angleVariance=45
//            snow.speedVariance=0
        

        
        
        
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        actualTrail=3
        bear = game.add.spine(posX1, game.world.centerY, 'bear')
        bear.scale.setTo(0.3)
        bear.setAnimationByName(0, "run", true)
        bear.setSkinByName("normal")
        
        bearProxy=game.add.sprite(bear.centerX,bear.centerY,"atlas.icyRush","smoke");
        bearProxy.anchor.setTo(0.5,1);
        bearProxy.alpha=0;
        bearProxy.scale.setTo(0.5,0.5)
        animalGroup.add(bear)
        
        sun=game.add.sprite(game.world.centerX,-50,"atlas.icyRush","solGirando");
        
        
        sun.scale.setTo(0.8,0.8);
        sun.anchor.setTo(0.5,0.5);
        game.add.tween(sun).to( { angle: 360 }, 9000, Phaser.Easing.Linear.None, true).loop(true);
        
        blueSky=game.add.tileSprite(game.world.centerX,100,game.world.width,300,"skyBack");
        blueSky.anchor.setTo(0.5,0.5);
        
        waterBack=game.add.tileSprite(game.world.centerX,250,game.world.width,50,"atlas.icyRush","tileWaves")
        waterBack.anchor.setTo(0.5,0.5);
        waterFront=game.add.tileSprite(game.world.centerX-100,280,game.world.width*2,50,"atlas.icyRush","tileWaves")
        waterFront.anchor.setTo(0.5,0.5);
        
        cloud=game.add.tileSprite(game.world.centerX,100,game.world.width,50,"atlas.icyRush","Nubes");
        cloud.anchor.setTo(0.5,0.5);
        
//        rails=game.add.tileSprite(game.world.centerX,game.world.height-100,game.world.width,100,"atlas.icyRush","nievePiso");
//        rails.anchor.setTo(0.5,0);
        
        
            back_emitter = game.add.emitter(game.world.centerX, -32, 600);
            back_emitter.makeParticles('snowflakes', [0, 1, 2]);
            back_emitter.maxParticleScale = 0.6;
            back_emitter.minParticleScale = 0.2;
            back_emitter.setYSpeed(20, 100);
            back_emitter.gravity = 0;
            back_emitter.width = game.world.width * 1.5;
            back_emitter.minRotation = 0;
            back_emitter.maxRotation = 40;

            
            
            changeWindDirection();

            back_emitter.start(false, 14000, 100);
        
            
        
        spaceRails=100;
        heightRails=0;
        
        for(var enoughRails=0; enoughRails<8; enoughRails++){
                    
            rails[enoughRails]=game.add.tileSprite(game.world.centerX,game.world.height-heightRails,game.world.width,spaceRails,"atlas.icyRush","nievePiso");
            rails[enoughRails].anchor.setTo(0.5,1);
            rails[enoughRails].scale.setTo(1,1);
            heightRails=(heightRails)+(100+100-spaceRails);
            backgroundGroup.add(rails[enoughRails]);
        }

//        fadeRails=game.add.sprite(game.world.centerX,game.world.centerY-150,"atlas.icyRush","nievePiso");
//        fadeRails.scale.setTo(game.world.width,-0.1);
//        fadeRails.alpha=0.7;
//        fadeRails.anchor.setTo(0.5,0.5)
//        
        mist=game.add.sprite(game.world.centerX,game.world.centerY-290,"atlas.icyRush","3");
        mist.scale.setTo(game.world.width,13);
        mist.alpha=0.7;
        mist.anchor.setTo(0.5,0.5)
        
        

        rails1=perspectiveHighway(9,game.world.centerY-175,game.world.centerX+100,0.1,0.1,backgroundGroup,"atlas.icyRush","tileCarriles");
        rails2=perspectiveHighway(9,game.world.centerY-175,game.world.centerX-95,0.1,0.1,backgroundGroup,"atlas.icyRush","tileCarriles");
        railsGap1=synchronyzeRails(9,rails1);
        railsGap2=synchronyzeRails(9,rails2);
             
        backgroundGroup.add(blueSky);
        backgroundGroup.add(sun);
        backgroundGroup.add(cloud);
        wavesGroup.add(waterBack);
        wavesGroup.add(waterFront); 
        
        
        posX1=game.world.centerX;
        posX2=game.world.centerX+190;
        posX3=game.world.centerX-190;
        
        typeOfObstacle[0]="rock";
        typeOfObstacle[1]="hole";
        typeOfObstacle[2]="coin";
        

        mask = game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.alpha=1;
        mask.drawRect(0, game.world.centerY-176, game.world.width,game.world.height);
        
        obstaclesGroup.add(mask)
        
        
        for(var fillObjs=0; fillObjs<6; fillObjs++){
            
            created[fillObjs]=false;
            
            if(fillObjs==0 || fillObjs==1){
                obstaclesLane[fillObjs]=game.add.sprite(posX1,game.world.height+100,"atlas.icyRush","monticuloNieve");
                obstaclesLane[fillObjs].tag=typeOfObstacle[0];
                obstaclesLane[fillObjs].scale.setTo(0.5,0.5);
                obstaclesLane[fillObjs].anchor.setTo(0.5,1);
            }
            if(fillObjs==2 || fillObjs==3){
                obstaclesLane[fillObjs]=game.add.sprite(posX1,game.world.height+100,"atlas.icyRush","pozo");
                obstaclesLane[fillObjs].tag=typeOfObstacle[1];
                obstaclesLane[fillObjs].scale.setTo(0.5,0.5);
                obstaclesLane[fillObjs].anchor.setTo(0.5,1);
                obstaclesLane[fillObjs].mask=mask
            }
            if(fillObjs==4 || fillObjs==5){
                obstaclesLane[fillObjs]=game.add.sprite(posX1,game.world.height+100,"coin");
                obstaclesLane[fillObjs].tag=typeOfObstacle[2];
                obstaclesLane[fillObjs].scale.setTo(0.5,0.5);
                obstaclesLane[fillObjs].anchor.setTo(0.5,1);
            }
            
            obstaclesGroup.add(obstaclesLane[fillObjs]);
        }
        smogGroup.add(back_emitter);
        //obstaclesGroup.add(fadeRails);
        obstaclesGroup.add(mist);
        for(var smog=0; smog<12; smog++){
            smog1=game.add.sprite(180*smog,40,"atlas.icyRush","smog");
            smog1.scale.setTo(1,1);
            game.add.tween(smog1.scale).to( {x: 1.4,y: 1.4}, game.rnd.integerInRange(900,1100), Phaser.Easing.Linear.None, true).loop(true).yoyo(true);
            smog1.alpha=1;
            smog1.anchor.setTo(0.5,0.5)
            smogGroup.add(smog1)
        }
        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
        
        
    }
    function right(){
        
        if(actualTrail<2 && startGame){
            actualTrail++
        }
    }
    function left(){
        if(actualTrail>0 && startGame){
            actualTrail--
        }
    }
    
    function changeWindDirection() {

        var multi = Math.floor((max + 200) / 4),
            frag = (Math.floor(Math.random() * 100) - multi);
        max = max + frag;

        if (max > 200) max = 150;
        if (max < -200) max = -150;

        setXSpeed(back_emitter, max);

    }

    function setXSpeed(emitter, max) {

        emitter.setXSpeed(max - 20, max);
        emitter.forEachAlive(setParticleXSpeed, this, max);

    }

function setParticleXSpeed(particle, max) {

    particle.body.velocity.x = max - Math.floor(Math.random() * 30);

}
    
    function perspectiveHighway(size,startPositionY, startPositionX, alphaProgramer, scalarProgramer, groupToDeposit, atlas, image){
        var railSeparation=new Array(size);
        

        var alphas=alphaProgramer;
        var scales=scalarProgramer
        for(var filling=0; filling<size; filling++){
            
            
            if(filling==0){
                saveDistance=0;
            }
            if(railSeparation[filling-1]){
                saveDistance=railSeparation[filling-1].height+saveDistance;
            }
            railSeparation[filling]=game.add.sprite(startPositionX+variationX,startPositionY+saveDistance,atlas,image);
            railSeparation[filling].alpha=alphas;
            railSeparation[filling].anchor.setTo(0.5,0);
            railSeparation[filling].scale.setTo(scales,scales);
            
            if(alphas<1){
                alphas=alphas+0.1; 
            }
            variationX=variationX-2;
            scales=scales+0.1;
            groupToDeposit.add(railSeparation[filling])
            
        }
        return railSeparation;
        groupToDeposit.anchor.setTo(0.5,0.5)
        
    }
    
    function startHighway(objectsToMove, speed, goal, gaps){
        var sizeOfArray=objectsToMove.length; 
        if(inverseGaps==null){
            nextPieceToPoisition=sizeOfArray-1;
            inverseGaps=sizeOfArray-1;
        }
        if(defaultScale==null){
            var scaleChangeY=0;
            var scaleChangeX=0;
            defaultScale=objectsToMove[sizeOfArray-1].scale;
        }
        var defaultposX=objectsToMove[sizeOfArray-1].x;
        
        for(var move=0; move<sizeOfArray; move++){
            
            if(objectsToMove[move].y>goal){
                
            objectsToMove[move].y+=speed;
            objectsToMove[move].alpha-=speed/-1800;
            objectsToMove[move].scale.x-=speed/-3000;
            }
            if(objectsToMove[move].y<=goal){
                objectsToMove[move].x=defaultposX
                objectsToMove[move].y=(objectsToMove[nextPieceToPoisition].y+objectsToMove[nextPieceToPoisition].height);
                objectsToMove[move].alpha=1;
                objectsToMove[move].scale.setTo(0.8,0.8);
                nextPieceToPoisition=move;
            }
        }
    }
     function startHighway2(objectsToMove, speed, goal, gaps){
        var sizeOfArray2=objectsToMove.length; 
        if(inverseGaps2==null){
            nextPieceToPoisition2=sizeOfArray2-1;
            inverseGaps2=sizeOfArray2-1;
        }
        if(defaultScale2==null){
            var scaleChangeY=0;
            var scaleChangeX=0;
            defaultScale2=objectsToMove[sizeOfArray2-1].scale;
        }
        var defaultposX=objectsToMove[sizeOfArray2-1].x;
        
        for(var move=0; move<sizeOfArray2; move++){
            
            if(objectsToMove[move].y>goal){
                
            objectsToMove[move].y+=speed;
            objectsToMove[move].alpha-=speed/-1800;
            objectsToMove[move].scale.x-=speed/-3000;
            }
            if(objectsToMove[move].y<=goal){
                objectsToMove[move].x=defaultposX
                objectsToMove[move].y=(objectsToMove[nextPieceToPoisition2].y+objectsToMove[nextPieceToPoisition2].height);
                objectsToMove[move].alpha=1;
                objectsToMove[move].scale.setTo(0.8,0.8);
                nextPieceToPoisition2=move;
            }
        }
    }
    
    
    function spawnObstacles(speed){
        
        
        
        var line=game.rnd.integerInRange(0,3);
        var objToSpawn=game.rnd.integerInRange(0,5);

        if(!created[objToSpawn] && roadSpeed!=0){
            
            if(line==0){

                obstaclesLane[objToSpawn].x=posX1;

            }else
            if(line==1){

                obstaclesLane[objToSpawn].x=posX2;

            }else
            if(line==2){

                obstaclesLane[objToSpawn].x=posX3;

            }
            obstaclesGroup.add(obstaclesLane[objToSpawn])
            sceneGroup.bringToTop(obstaclesLane[objToSpawn])
            
            created[objToSpawn]=true; 
            
            obstaclesLane[objToSpawn].scale.setTo(0.5,0.5)
            obstaclesLane[objToSpawn].alpha=1
            
            if(obstaclesLane[objToSpawn].tag!="hole" && obstaclesLane[objToSpawn].tag!="coin"){
                tweenObj[objToSpawn]=game.add.tween(obstaclesLane[objToSpawn]).to( {y: game.world.centerY-145}, speed, Phaser.Easing.Linear.In, true)
                tweenObjSc[objToSpawn]=game.add.tween(obstaclesLane[objToSpawn].scale).to( {x:0.3,y:0}, speed, Phaser.Easing.Linear.In, true,speed)
            }else{
                tweenObj[objToSpawn]=game.add.tween(obstaclesLane[objToSpawn]).to( {y: game.world.centerY-160}, speed, Phaser.Easing.Linear.In, true)
                tweenObjSc[objToSpawn]=game.add.tween(obstaclesLane[objToSpawn].scale).to( {x:0.3,y:0}, speed*0.05, Phaser.Easing.Linear.In, true,speed)
            }
            tweenObjAl[objToSpawn]=game.add.tween(obstaclesLane[objToSpawn]).to( {alpha: 0}, speed*0.5, Phaser.Easing.Linear.In, true,speed+speed*0.5)
            tweenObjAl[objToSpawn].onStart.add(function(obj){
                

            })
                
                
            }
        startSpawn();
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        if(lives!=0){
            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }
    }

    function startSpawn(){
        game.time.events.add(500,function(){
            if(startGame){
                spawnObstacles(speed);
            }
        })
    }
    
   
    
    function synchronyzeRails(size,objectsToGap){
        
        var gapsBetweenAll=new Array(size); 
        
        for(var reduceGaps=(size-1); reduceGaps>0; reduceGaps--){
            gapsBetweenAll[reduceGaps]=objectsToGap[size-1].height-objectsToGap[reduceGaps].height;
        }
        return gapsBetweenAll;
    }
	
    function Rails(obj){
        
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
                if(pointsBar.number%5==0 && pointsBar.number!=0 && pointsBar.number!=1){
                    speed-=300;
                    roadSpeed-=0.25;
                }
            })
        })
    }
  
    
	function update(){
        
        startHighway(rails1,roadSpeed,game.world.centerY-350,railsGap1)
        startHighway2(rails2,roadSpeed,game.world.centerY-350,railsGap2)
        
        for(var checkUp=0; checkUp<obstaclesLane.length; checkUp++){

                if(obstaclesLane[checkUp].scale.y==0){
                    tweenObj[checkUp].stop();
                    tweenObjAl[checkUp].stop();
                    tweenObjSc[checkUp].stop();
                    obstaclesLane[checkUp].y=game.world.height+100;
                    created[checkUp]=false;
                }
            }
        
               
        i++;

        if (i === update_interval)
        {
            changeWindDirection();
            update_interval = Math.floor(Math.random() * 20) * 60; // 0 - 20sec @ 60fps
            i = 0;
        }
        
      
        
        
        
        epicparticles.update()
        if(startGame){
            bearProxy.x=bear.x;
            bearProxy.y=bear.y;
            if(lives==0){
                startGame=false;
                roadSpeed=0;
                for(var disapearObjs=0; disapearObjs<obstaclesLane.length; disapearObjs++){
                    
                    if(tweenObj[disapearObjs]){
                        tweenObj[disapearObjs].stop();
                        tweenObjAl[disapearObjs].stop();
                        tweenObjSc[disapearObjs].stop();
                    }
                }
            }
            waterBack.tilePosition.x+=0.2;
            waterFront.tilePosition.x-=0.3;
            cloud.tilePosition.x-=0.4;
            
            
            
            for(var checkOver=0; checkOver<obstaclesLane.length; checkOver++){
                
                
                if (checkOverlap(bearProxy, obstaclesLane[checkOver]))
                {
                    tweenObj[checkOver].stop();
                    tweenObjAl[checkOver].stop();
                    tweenObjSc[checkOver].stop();
                    if(obstaclesLane[checkOver].tag=="rock" && created[checkOver]){
                        //Animation
                        counterFall++;
                        roadSpeed=0;
                        stopRoadandObjects()
                        if(lives!=0){
                            missPoint()
                            bear.scale.setTo(0.3,0.3);
                            bearProxy.scale.setTo(0.5,0.5)
                            bear.y=game.world.centerY;
                            bear.alpha=1
                            counterFall=0;
                        }
                        created[checkOver]=false;
                        if(lives!=0){
                            obstaclesLane[checkOver].y=game.world.height+100;
                            bear.setAnimationByName(0,"hit",false);
                            game.time.events.add(600,function(){
                                bear.setAnimationByName(0,"run",true);
                                roadSpeed=-3;
                            })
                        }else{
                            bear.setAnimationByName(0,"hit_lose",false);
                        }
                        
                        bearProxy.scale.setTo(bearProxy.scale.x-0.2,bearProxy.scale.y-0.2);
                    }else if(obstaclesLane[checkOver].tag=="hole" && created[checkOver]){
                        //Animation
                        missPoint()
                        created[checkOver]=false;
                        if(lives==0){
                            bear.setAnimationByName(0,"fall_lose",false);
                        }
                        if(lives>0){
                            obstaclesLane[checkOver].y=game.world.height+100;
                            bear.setAnimationByName(0,"fall",false);
                            game.time.events.add(300,function(){
                                bear.setAnimationByName(0,"run",true);
                            })
                        }   
                    }else if(obstaclesLane[checkOver].tag=="coin"){
                        //Animation
                        created[checkOver]=false;
                        obstaclesLane[checkOver].y=game.world.height+100;
                        Coin(bear,pointsBar,50);
                    }
                }
            }
        }
        
        
        if(controles.left.isDown && keyPressed==false){
            
            left()
            keyPressed=true
            
        }else if(controles.right.isDown && keyPressed2==false){
            
            right()
            keyPressed2=true
            
        }
        
        if(controles.left.isUp && keyPressed==true){
            
            keyPressed=false
 
        }else if(controles.right.isUp && keyPressed2==true){
            
            keyPressed2=false
        }
        if(!noDistortion){
            if(actualTrail==2)
            {
                noDistortion=true;
                //character.position.y=game.world.height-650
                game.add.tween(bear).to( { x: posX2 }, 70, Phaser.Easing.Linear.In, true).onComplete.add(function(){
                    noDistortion=false;
                });
            }
            if(actualTrail==1)
            {   
                noDistortion=true;
                //character.position.y=game.world.height-350  
                game.add.tween(bear).to( { x: posX1 }, 70, Phaser.Easing.Linear.In, true).onComplete.add(function(){
                    noDistortion=false;
                });
            }
            if(actualTrail==0)
            {
                noDistortion=true;
                //character.position.y=game.world.height-50
                game.add.tween(bear).to( { x: posX3 }, 70, Phaser.Easing.Linear.In, true).onComplete.add(function(){
                    noDistortion=false;
                });
            }
        }
	}

    function stopRoadandObjects(){
        
        for(var disapearObjs=0; disapearObjs<obstaclesLane.length; disapearObjs++){            
            if(tweenObj[disapearObjs]){
                tweenObj[disapearObjs].stop();
                tweenObjAl[disapearObjs].stop();
                tweenObjSc[disapearObjs].stop();
                created[disapearObjs]=false;
                obstaclesLane[disapearObjs].y=game.world.height+100;
            }
        }
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
        particle.makeParticles('atlas.icyRush',key);
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

				particle.makeParticles('atlas.icyRush',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.icyRush','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.icyRush','smoke');
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
		name: "icyRush",
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