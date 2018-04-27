
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var lakeStrike = function(){
    
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
                name: "atlas.lake",
                json: "images/lake/atlas.json",
                image: "images/lake/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/lake/timeAtlas.json",
                image: "images/lake/timeAtlas.png",
            },

        ],
        images: [

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
            {	name: "hit",
				file: soundsPath + "punch3.mp3"},
            {	name: "laugh",
				file: soundsPath + "insectLaghing.mp3"},
            
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 125
	var indexGame
    var overlayGroup
    var lakeSong
    var diameter,x,y
    var backgroundGroup=null
    var direction, angle, speedDelta, radius
    var howMany
    var pollutionAttacking=new Array(9)
    var hits=new Array(9)
    var pollutionAttackingActive=new Array(9)
    var pollutionTween=new Array(9)
    var pollutionDefeated=new Array(9)
    var clockStarts
    var goal
    var dificulty, goalToGet, goalReached, speedCreate
    var fast

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#220341"
        lives = 3
        diameter=500
        x=0.1
        y=0.1
        howMany=0
        dificulty=1500
        goalToGet=10
        goalReached=0
        goal=10
        x = 0;    
        y = 0;    
        angle = 0;    
        direction = 1;    
        speedDelta = 0.002;
        fast = 1.64
        speedCreate=8000;
        radius = 150; 
        loadSounds()
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.lake','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.lake','life_box')

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
        
        
        
        
        lakeSong.stop()
        		
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
        
        game.load.audio('lakeSong', soundsPath + 'songs/dancing_baby.mp3');
        
        game.load.spine('justice', "images/Spine/justice/justice.json");
        
        game.load.spine('lake', "images/Spine/lake/lake.json");
        
		/*game.load.image('howTo',"images/lake/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/lake/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/lake/introscreen.png")*/
        
        game.load.spritesheet("pollutionMoving", 'images/Spine/Pollution/224X220_25F_24FPS.png', 224, 220, 25)
        game.load.spritesheet("pollutionKilled", 'images/Spine/Pollution/244X279_25F_24FPS.png', 244, 279, 25)
        game.load.spritesheet("coin", 'images/Spine/coin/coin.png', 122, 123, 12)
        
		
		game.load.image('tutorial_image',"images/lake/tutorial_image.png")
        //loadType(gameIndex)

        game.time.advancedTiming = true;
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
        
        /*var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("pop")
            
            //Aqui va la primera funciòn que realizara el juego
            
            startGame=true
            returnGenerate()
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.lake','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'Movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.lake',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.lake','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
        startGame=true
        returnGenerate()
        overlayGroup.y = -game.world.height
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        backgroundGroup = game.add.group()
        lakeGroup=game.add.group()
        pollutionGroup = game.add.group()

        sceneGroup.add(backgroundGroup)
        sceneGroup.add(lakeGroup)
        sceneGroup.add(pollutionGroup)

        game.physics.startSystem(Phaser.Physics.ARCADE); 
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        
        
        // grass
        grass=game.add.tileSprite(0,0,game.world.width,game.world.height,"atlas.lake","tile_floor")
        grass.scale.setTo(1,1)
        grass.alpha=1
        backgroundGroup.add(grass)
        
        
        // lake
        lake=game.add.sprite(game.world.centerX,game.world.centerY,"atlas.lake","lake")
        lake.scale.setTo(0.7,0.7)
        lake.anchor.setTo(0.5,0.5)
        lake.alpha=1
        lakeGroup.add(lake)
        
        //ProxyLake
        
        proxyLake=game.add.sprite(game.world.centerX,game.world.centerY,"atlas.lake","lake")
        proxyLake.scale.setTo(0.1,0.1)
        proxyLake.anchor.setTo(0.5,0.5)
        proxyLake.alpha=0
        lakeGroup.add(proxyLake)
        
        //Lake
        
        lakeSpine = game.add.spine(proxyLake.centerX-3,game.world.centerY+155, "lake");
        lakeSpine.scale.setTo(0.7,0.7)
        lakeSpine.setSkinByName("clean");
        lakeSpine.setAnimationByName(0,"idle",true) 
        lakeGroup.add(lakeSpine)
        
        
        Justice = game.add.spine(proxyLake.centerX,proxyLake.centerY, "justice");
        Justice.scale.setTo(0.5,0.5)
        Justice.setSkinByName("normal");
        Justice.setAnimationByName(0,"SIDE_WALK",true) 
        lakeGroup.add(Justice)

        //proxyJustice
        
        proxyJustice=game.add.sprite(game.world.centerX,game.world.centerY,"atlas.lake","water")
        proxyJustice.scale.setTo(0.6,0.6)
        proxyJustice.anchor.setTo(0.5,0.5)
        proxyJustice.alpha=0
        lakeGroup.add(proxyJustice)
        
        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
        
        //Bush 1
        
        bush=game.add.sprite(50,game.world.height-50,"atlas.lake", "bush")
        bush.anchor.setTo(0.5)
        bush.scale.setTo(-1,1)
        bush.alpha=1
        backgroundGroup.add(bush)
        
        //Bush 2
        
        bush2=game.add.sprite(game.world.width-50,game.world.height-50,"atlas.lake", "bush")
        bush2.anchor.setTo(0.5)
        bush2.scale.setTo(1,1)
        bush2.alpha=1
        backgroundGroup.add(bush2)
        
        //Bush 3
        
        bush3=game.add.sprite(50,70,"atlas.lake", "bush")
        bush3.anchor.setTo(0.5)
        bush3.scale.setTo(-1,-1)
        bush3.alpha=1
        backgroundGroup.add(bush3)
        
        //Bush 4
        
        bush4=game.add.sprite(game.world.width-60,70,"atlas.lake", "bush")
        bush4.anchor.setTo(0.5)
        bush4.scale.setTo(1,-1)
        bush4.alpha=1
        backgroundGroup.add(bush4)
        
        var poly = game.add.graphics(game.world.centerX, game.world.centerY);
        //Agregar linea para fisicas : game.physics.startSystem(Phaser.Physics.ARCADE);
        poly.beginFill("0x003a37", 1);
        poly.alpha=0.3
        poly.drawCircle(0, 0, 900);
        backgroundGroup.add(poly)
        
        
        diameter=300
        
        
        
        var rect2 = new Phaser.Graphics(game)
        rect2.beginFill(0x000000)
        rect2.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect2.alpha = 0
        rect2.endFill()
        rect2.inputEnabled = true
        backgroundGroup.add(rect2)
        rect2.events.onInputDown.add(function(){
            changeRotation()
        })
        
        
        for(var fill=0;fill<pollutionAttacking.length;fill++){
            
            pollutionAttacking[fill]=game.add.sprite(-200,0,'pollutionMoving');
            pollutionAttacking[fill].scale.setTo(0.5,0.5)
            pollutionAttacking[fill].anchor.setTo(0.5,0.5)
            pollutionAttacking[fill].animations.add('move');
            pollutionAttacking[fill].animations.play('move', 24, true);
            pollutionGroup.add(pollutionAttacking[fill])
            
            pollutionDefeated[fill]=game.add.sprite(-200,0,'pollutionKilled');
            pollutionDefeated[fill].scale.setTo(0.5)
            pollutionDefeated[fill].alpha=0;
            pollutionDefeated[fill].anchor.setTo(0.5)
            pollutionDefeated[fill].animations.add('kill');
            pollutionGroup.add(pollutionDefeated[fill])
            
            hits[fill]=game.add.sprite(pollutionAttacking.x,pollutionAttacking.y,"atlas.lake","hit");
            hits[fill].scale.setTo(0.5)
            hits[fill].alpha=0;
            hits[fill].anchor.setTo(0.5,0.5)
            pollutionGroup.add(hits[fill])
            
            pollutionAttackingActive[fill]=false;
        }
        
    }
	
    
    function generateThem(){
        
        enemyGenerator(pollutionAttacking,pollutionAttackingActive,pollutionTween,goal,speedCreate);
        returnGenerate()
    }
    
    function returnGenerate(){
        
        game.time.events.add(dificulty,function(){
          
            generateThem()
            
        })
    }
    
    
    function changeRotation(){
        direction *= -1;
    }
    function inputs(obj){
        
        //Listo para programar
        console.log("Tell me to do something")
        
    }
    
    
    
	function update(){
        
        
        if(startGame){
            
            moveCircle(proxyJustice)
            Justice.position.x=proxyJustice.position.x;
            Justice.position.y=proxyJustice.position.y+30;
            
            for(var samePos=0; samePos<pollutionAttacking.length;samePos++){
                
                pollutionDefeated[samePos].x=pollutionAttacking[samePos].x;
                pollutionDefeated[samePos].y=pollutionAttacking[samePos].y;
                hits[samePos].x=pollutionAttacking[samePos].x;
                hits[samePos].y=pollutionAttacking[samePos].y-50;
                hits[samePos].angle=pollutionAttacking[samePos].angle;
                pollutionDefeated[samePos].angle=pollutionAttacking[samePos].angle;
                
                
            }
            
            for(var checkOverlaping=0;checkOverlaping<pollutionAttacking.length;checkOverlaping++){
                if (checkOverlap(proxyJustice,pollutionAttacking[checkOverlaping]) && pollutionAttackingActive[checkOverlaping] && lives>0){
                    var temp=checkOverlaping
                    Coin(pollutionAttacking[checkOverlaping],pointsBar,100);
                    sound.play("hit")
                    pollutionAttackingActive[checkOverlaping]=false
                    pollutionAttacking[checkOverlaping].alpha=0
                    pollutionDefeated[checkOverlaping].alpha=1
                    hits[checkOverlaping].alpha=1
                    pollutionDefeated[checkOverlaping].animations.play('kill', 12, true);
                    pollutionTween[checkOverlaping].stop()
                    game.time.events.add(800,function(){
                        pollutionDefeated[temp].animations.stop('kill')
                        game.add.tween(hits[temp]).to({alpha:0},100,Phaser.Easing.Cubic.Out,true);
                        pollutionDefeated[temp].alpha=0
                        pollutionAttacking[temp].position.x=-200
                        howMany--;
                        goalReached++;
                        if(goalReached==goalToGet && dificulty>1000){
                            speedCreate-=1000;
                            dificulty-=500;
                            goalToGet+=5;
                            goalReached=0;
                        }
                    })
                        
                }
                if (checkOverlap(proxyLake,pollutionAttacking[checkOverlaping]) && pollutionAttackingActive[checkOverlaping] && lives>0)
                {
                        var temp2=checkOverlaping
                        
                        missPoint()
                        if(lives==2){
                            //lakeSpine.setTint("0xff1500")
                            game.add.tween(lakeSpine).to({alpha:0.1},200,Phaser.Easing.linear,true).onComplete.add(function(){
                                game.add.tween(lakeSpine).to({alpha:1},100,Phaser.Easing.linear,true)
                                lakeSpine.setSkinByName("dirty1")
                                //lakeWater.setTint("0xffffff")
                            })
                        }
                        if(lives==1){
                            //lakeSpine.setTint("0xff1500")
                            game.add.tween(lakeSpine).to({alpha:0.1},200,Phaser.Easing.linear,true).onComplete.add(function(){
                                game.add.tween(lakeSpine).to({alpha:1},100,Phaser.Easing.linear,true)
                                lakeSpine.setSkinByName("dirty2")
                                //lakeSpine.setTint("0xffffff")
                            })
                        }
                        if(lives==0){
                            //lakeSpine.setTint("0xff1500")
                            game.add.tween(lakeSpine).to({alpha:0.1},200,Phaser.Easing.linear,true).onComplete.add(function(){
                                game.add.tween(lakeSpine).to({alpha:1},100,Phaser.Easing.linear,true)
                                lakeSpine.setSkinByName("dirty3")
                                //lakeSpine.setTint("0xffffff")
                            })
                        }
                        sound.play("laugh")
                        game.add.tween(pollutionAttacking[checkOverlaping]).to({alpha:0},505,Phaser.Easing.linear,true, 100)
                        game.add.tween(pollutionAttacking[checkOverlaping].scale).to({x:0,y:0},500, Phaser.Easing.Linear.In, true)
                        Justice.setAnimationByName(0,"BACK_WRONG",false)
                        pollutionAttackingActive[checkOverlaping]=false
                        pollutionTween[checkOverlaping].stop()
                        howMany--;
                        game.time.events.add(300,function(){
                            Justice.setAnimationByName(0,"SIDE_WALK",true)
                            pollutionAttacking[temp2].scale.setTo(0.5)
                            pollutionAttacking[temp2].position.x=-200
                        })
                }
            }
        }
	}
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    }
    
    function Coin(objectBorn,objectDestiny,time){
        
        
        //objectBorn= Objeto de donde nacen
        coins.x=objectBorn.centerX
        coins.y=objectBorn.centerY
        
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
    
    function moveCircle(obj){
        
        
        if (direction == 1) {      
            speedDelta = fast;
            if(obj.position.y>game.world.centerY){
                Justice.scale.setTo(-0.5,0.5);
            }else if(obj.position.y<game.world.centerY){
                Justice.scale.setTo(0.5,0.5);
            }
            
            
        } else if (direction == -1) {
            speedDelta = -fast;
            if(obj.position.y>game.world.centerY){
                Justice.scale.setTo(0.5,0.5);
            }else if(obj.position.y<game.world.centerY){
                Justice.scale.setTo(-0.5,0.5);
            }
            
        }
        angle += game.time.physicsElapsed  * speedDelta; 
        obj.x =  Math.cos(angle) * radius + game.world.centerX;    
        obj.y =  Math.sin(angle) * radius + game.world.centerY;
        
        
    }
    
    
    
    function reset(){
            
            
    }
    
	function enemyGenerator(enemys,enemysActive,enemyTween, howMuch, speed, params){
        params = params || {}
        var destinyX=params.destinyX || game.world.centerX
        var destinyY=params.destinyY || game.world.centerY
        var where=game.rnd.integerInRange(0,3);
        var generate=game.rnd.integerInRange(0,9);
        
        if(howMany<howMuch){
            if(where==0){

                while(enemysActive[generate]==true){
                    generate=game.rnd.integerInRange(0,9);
                }
                if(enemysActive[generate]==false){
                    enemys[generate].alpha=1
                    enemys[generate].position.x=game.rnd.integerInRange(0,game.world.width);
                    enemys[generate].position.y=-200;
                    enemys[generate].angle= (Math.atan2(destinyY - enemys[generate].y, destinyX - enemys[generate].x) * 180 / Math.PI)-60;
                    enemyTween[generate]=game.add.tween(enemys[generate]).to({x:destinyX,y:destinyY},speed,Phaser.Easing.In,true);
                    enemysActive[generate]=true;
                    howMany++;
                }
            }else if(where==1){

                 while(enemysActive[generate]==true){
                    generate=game.rnd.integerInRange(0,9);
                }
                if(enemysActive[generate]==false){
                    enemys[generate].alpha=1
                    enemys[generate].position.x=game.world.width+200
                    enemys[generate].position.y=game.rnd.integerInRange(0,game.world.height);
                    enemys[generate].angle= (Math.atan2(destinyY - enemys[generate].y, destinyX - enemys[generate].x) * 180 / Math.PI)-60;
                    enemyTween[generate]=game.add.tween(enemys[generate]).to({x:destinyX,y:destinyY},speed,Phaser.Easing.In,true);
                    enemysActive[generate]=true;
                    howMany++;
                }
            }else if(where==2){

                 while(enemysActive[generate]==true){
                    generate=game.rnd.integerInRange(0,9);
                }
                if(enemysActive[generate]==false){
                    enemys[generate].alpha=1
                    enemys[generate].position.x=game.rnd.integerInRange(0,game.world.width);
                    enemys[generate].position.y=game.world.height+200;
                    enemys[generate].angle= (Math.atan2(destinyY - enemys[generate].y, destinyX - enemys[generate].x) * 180 / Math.PI)-60;
                    enemyTween[generate]=game.add.tween(enemys[generate]).to({x:destinyX,y:destinyY},speed,Phaser.Easing.In,true);
                    enemysActive[generate]=true;
                    howMany++;
                }
            }else if(where==3){

                 while(enemysActive[generate]==true){
                    generate=game.rnd.integerInRange(0,9);
                }
                if(enemysActive[generate]==false){
                    enemys[generate].alpha=1
                    enemys[generate].position.x=-100;
                    enemys[generate].position.y=game.rnd.integerInRange(0,game.world.height);
                    enemys[generate].angle= (Math.atan2(destinyY - enemys[generate].y, destinyX - enemys[generate].x) * 180 / Math.PI)-60;
                    enemyTween[generate]=game.add.tween(enemys[generate]).to({x:destinyX,y:destinyY},speed,Phaser.Easing.In,true);
                    enemysActive[generate]=true;
                    howMany++;
                }
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
        particle.makeParticles('atlas.lake',key);
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

				particle.makeParticles('atlas.lake',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.lake','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.lake','smoke');
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
		name: "lakeStrike",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
           
			addParticles()
                        			
            lakeSong = game.add.audio('lakeSong')
            game.sound.setDecodedCallback(lakeSong, function(){
                lakeSong.loopFull(0.6)
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
			
			buttons.getButton(lakeSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()