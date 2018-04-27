
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
				file:"images/icyRush/fondoDegradado.png"
			}

		],
        spines: [

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
    var rails1=new Array();
    var rails2=new Array();
    var startPosition;
    var spaceRails;
    var heightRails;
	var indexGame
    var overlayGroup
    var baseSong
    
    var backgroundGroup=null
    
    var tweenTiempo
    var clock, timeBar
    var emitter
    var rails=new Array(20);

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){
          
        game.stage.backgroundColor = "#000000"
        lives = 3
        emitter=""
        startPosition=game.world.centerY-195;
        spaceRails=100;
        heightRails=100;
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
        
        
            
            
        
        spaceRails=100;
        heightRails=0;
        
        for(var enoughRails=0; enoughRails<8; enoughRails++){
                    
            rails[enoughRails]=game.add.tileSprite(game.world.centerX,game.world.height-heightRails,game.world.width,spaceRails,"atlas.icyRush","nievePiso");
            rails[enoughRails].anchor.setTo(0.5,1);
            rails[enoughRails].scale.setTo(1,1);
            heightRails=(heightRails)+(100+100-spaceRails);
            backgroundGroup.add(rails[enoughRails]);
        }

        fadeRails=game.add.sprite(game.world.centerX,game.world.centerY+80,"atlas.icyRush","fadeNieve");
        fadeRails.scale.setTo(game.world.width,8);
        fadeRails.alpha=0.4;
        fadeRails.anchor.setTo(0.5,0.5)
        
        
        
//        railSeparation4=game.add.sprite(game.world.centerX,game.world.centerY-195,"atlas.icyRush","tileCarriles");
//        railSeparation4.alpha=0.4;
//        railSeparation4.scale.setTo(0.6,0.6);
//        railSeparation5=game.add.sprite(game.world.centerX+45,game.world.centerY-65,"atlas.icyRush","tileCarriles");
//        railSeparation5.alpha=0.6;
//        railSeparation5.scale.setTo(0.7,0.7);
//        railSeparation6=game.add.sprite(game.world.centerX+40,game.world.centerY+84.5,"atlas.icyRush","tileCarriles");
//        railSeparation6.alpha=0.8;
//        railSeparation6.scale.setTo(0.8,0.8);
//        railSeparation7=game.add.sprite(game.world.centerX+35,game.world.centerY+255,"atlas.icyRush","tileCarriles");
//        railSeparation7.alpha=1;
//        railSeparation7.scale.setTo(0.9,0.9);
//        railSeparation8=game.add.sprite(game.world.centerX+30,game.world.centerY+448,"atlas.icyRush","tileCarriles");
//        railSeparation8.alpha=1;
//        railSeparation8.scale.setTo(1,1);
        
//        
//        game.add.tween(rails[0]).to({y:game.world.centerY-200},9000,Phaser.Easing.Cubic.Linear,true)
//        game.add.tween(rails[0].scale).to({y:0},10000,Phaser.Easing.linear,true)
        backgroundGroup.add(fadeRails);
        
        rails1=perspectiveHighway(6,game.world.centerY-175,game.world.centerX+60,0.1,0.4,backgroundGroup,"atlas.icyRush","tileCarriles");
        
        rails2=perspectiveHighway(6,game.world.centerY-175,game.world.centerX-100,0.1,0.4,backgroundGroup,"atlas.icyRush","tileCarriles");
        
        
             
        backgroundGroup.add(blueSky);
        backgroundGroup.add(sun);
        backgroundGroup.add(cloud);
        backgroundGroup.add(waterBack);
        backgroundGroup.add(waterFront);
        
       
        
        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
        
        
    }
    
    
    function perspectiveHighway(size,startPositionY, startPositionX, alphaProgramer, scalarProgramer, groupToDeposit, atlas, image){
        var railSeparation=new Array(size);
        
        var saveDistance=0;
        var variationX=0;
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
    }
    
    function startHighway(objectsToMove, speed, goal){
        
        
        var sizeOfArray=objectsToMove.length;
        var nextPieceToPoisition=sizeOfArray-1;
        var scaleChangeY=0;
        var scaleChangeX=0;
        var defaultposX=objectsToMove[sizeOfArray-1].x;
        var defaultScale=objectsToMove[sizeOfArray-1].scale.y;
        for(var move=0; move<sizeOfArray; move++){
            objectsToMove[move].y+=speed;
//            goal=objectsToMove[move].height/goal;
            objectsToMove[move].alpha-=0.00075;
            scaleChangeY=0;
            scaleChangeY=objectsToMove[move].scale.y+0.0002;
            scaleChangeX=0;
            scaleChangeX=objectsToMove[move].scale.x-0.0005;
            objectsToMove[move].scale.setTo(scaleChangeX,scaleChangeY);
            if(objectsToMove[move].y<=goal){
                objectsToMove[move].scale.setTo(defaultScale,defaultScale);
                objectsToMove[move].x=defaultposX
                objectsToMove[move].y=objectsToMove[nextPieceToPoisition].y+objectsToMove[nextPieceToPoisition].height;
                nextPieceToPoisition=move;
                objectsToMove[move].alpha=0.8;
            }
        }
        
        
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
            })
        })
    }
  
    
	function update(){
        
        
        if(startGame){
            epicparticles.update()
            waterBack.tilePosition.x+=0.2;
            waterFront.tilePosition.x-=0.3;
            cloud.tilePosition.x-=0.4;
        }
         startHighway(rails1,-1,game.world.centerY-320)
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