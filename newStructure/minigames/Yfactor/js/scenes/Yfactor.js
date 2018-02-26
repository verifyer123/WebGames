
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var tutorialPath = "../../shared/minigames/"
var Yfactor = function(){
    
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
                name: "atlas.Yfactor",
                json: "images/Yfactor/atlas.json",
                image: "images/Yfactor/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/Yfactor/timeAtlas.json",
                image: "images/Yfactor/timeAtlas.png",
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
				file:"images/Yfactor/tutorial_image_%input.png"
			}

		],
        spines: [
            {
                name: "dancer_american",
                file: "images/Spine/american_indian/american _indian.json",
            },
            {
                name: "dancer_chinese",
                file: "images/Spine/chinese/chinese.json",
            },
            {
                name: "dancer_corean",
                file: "images/Spine/corean/corean.json",
            },
            {
                name: "dancer_japanese",
                file: "images/Spine/japanese/japanese.json",
            },
            {
                name: "dancer_mexican",
                file: "images/Spine/mexican/mexican.json",
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
				file: soundsPath + 'songs/childrenbit.mp3'},
            {   name:"cheers",
				file: soundsPath + 'cheers.mp3'},
            {   name:"point",
				file: soundsPath + 'point.mp3'},
            {   name:"Ame",
				file: soundsPath + 'songs/American.mp3'},
            {   name:"Mex",
				file: soundsPath + 'songs/Mexico.mp3'},
            {   name:"Jap",
				file: soundsPath + 'songs/Japon.mp3'},
            {   name:"Cor",
				file: soundsPath + 'songs/Corea.mp3'},
			
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
    var gameIndex = 151
    var tutoGroup
	var indexGame
    var overlayGroup
    var baseSong
    var tempo=new Array(5);
    var counter
    var speed, metronome, start
    
    var pieceUp=new Array(15);
    var pieceDown=new Array(15);
    var pieceLeft=new Array(15);
    
    var pieceUpActive=new Array(15);
    var pieceDownActive=new Array(15);
    var pieceLeftActive=new Array(15);
    
    var pieceUpTween=new Array(15);
    var pieceDownTween=new Array(15);
    var pieceLeftTween=new Array(15);
    
    var backgroundGroup=null
    var countUps, countLefts, countDowns;
    var tweenTiempo
    var clock, timeBar
    var emitter
    var pieceSpot,pieceSpot2,pieceSpot3
    var piece, actual
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){
          
        game.stage.backgroundColor = "#000000"
        lives = 3
        emitter=""
        piece=0;
        speed=70
        counter=0;
        start=false;
        countDowns=0;
        countLefts=0;
        countUps=0;
        metronome=0
        loadSounds()
        //tempo[0]=162;
        tempo[0]=500;
        tempo[1]=450;
        tempo[2]=400;
        tempo[3]=350;
	}

    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
        game.time.events.add(300,function(){
            choosePiece();
            start=true;
        })
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.Yfactor','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.Yfactor','life_box')

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
        
        
        
        
        if(actual===0){
            Mexican.stop();
        }else if(actual===1){
            Japanese.stop();
        }else if(actual===2){
            Corean.stop();
        }else if(actual===3){
            American.stop();
        }
        		
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
        
        dancersGroup=game.add.group();
        sceneGroup.add(dancersGroup)
        
        piecesGroup = game.add.group()
        sceneGroup.add(piecesGroup)
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        
        //Acomodamos el background
        
        scenario=game.add.sprite(game.world.centerX,game.world.centerY-100,"atlas.Yfactor","BACKSTAGE");
        scenario.anchor.setTo(0.5,0.5)
        scenario.scale.setTo(game.world.width/550,1);
        
        floor=game.add.sprite(game.world.centerX,game.world.centerY+360,"atlas.Yfactor","STAGE");
        floor.anchor.setTo(0.5,0.5)
        floor.scale.setTo(game.world.width/580,2);
        
        board=game.add.sprite(game.world.centerX,game.world.height-100,"atlas.Yfactor","BOARD");
        board.anchor.setTo(0.5,0.5);
        board.scale.setTo(game.world.width-game.world.width+1,1)
        
        goal=game.add.sprite(board.x-150,game.world.height-100,"atlas.Yfactor","GAUGE");
        goal.anchor.setTo(0.5,0.5);
        
        goalProxy=game.add.sprite(board.x-150,game.world.height-100,"atlas.Yfactor","GAUGE");
        goalProxy.anchor.setTo(0.5,0.5);
        goalProxy.scale.setTo(0.5,1);
        goalProxy.alpha=0;
        
        lose=game.add.sprite(board.x-220,game.world.height-100,"atlas.Yfactor","GAUGE");
        lose.anchor.setTo(0.5,0.5);
        lose.scale.setTo(0.5,1)
        lose.alpha=0;
        
        backgroundGroup.add(scenario);
        backgroundGroup.add(floor);
        backgroundGroup.add(board);
        backgroundGroup.add(goal);
        
        //Creating the dancers
        
        
        dancerM=game.add.spine(game.world.centerX,game.world.centerY+260,"dancer_mexican");
        dancerM.setSkinByName("normal");
        dancerM.setAnimationByName(0,"dance",true);
        
        dancerJ=game.add.spine(game.world.centerX,game.world.centerY+260,"dancer_japanese");
        dancerJ.setSkinByName("normal");
        dancerJ.setAnimationByName(0,"dance",true);
        
        dancerC=game.add.spine(game.world.centerX,game.world.centerY+260,"dancer_corean");
        dancerC.setSkinByName("normal");
        dancerC.setAnimationByName(0,"dance",true);
        
        dancerA=game.add.spine(game.world.centerX,game.world.centerY+260,"dancer_american");
        dancerA.setSkinByName("normal");
        dancerA.setAnimationByName(0,"dance",true);
        
        dancerM.alpha=0;
        dancerJ.alpha=0;
        dancerC.alpha=0;
        dancerA.alpha=0;
        
        dancersGroup.add(dancerM);
        dancersGroup.add(dancerJ);
        dancersGroup.add(dancerC);
        dancersGroup.add(dancerA);
        
        
        
        //Create Pieces
        
        for(var fill=0; fill<pieceUp.length;fill++){
            pieceDown[fill]=game.add.sprite(board.x+210,game.world.height-75,"atlas.Yfactor","DOWN");
            pieceLeft[fill]=game.add.sprite(board.x+210,game.world.height-120,"atlas.Yfactor","MID");
            pieceUp[fill]=game.add.sprite(board.x+210,game.world.height-165,"atlas.Yfactor","UP");
            piecesGroup.add(pieceLeft[fill]);
            piecesGroup.add(pieceUp[fill]);
            piecesGroup.add(pieceDown[fill]);
            pieceDown[fill].alpha=0;
            pieceLeft[fill].alpha=0;
            pieceUp[fill].alpha=0;
        }
        
        //Strumer
        
        rect2 = new Phaser.Graphics(game)
        rect2.beginFill(0xffffff)
        rect2.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect2.alpha = 0
        rect2.endFill()
        rect2.inputEnabled=true
        rect2.events.onInputDown.add(strum, this);
		sceneGroup.add(rect2)
        
        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
    }
    
    function passEscenario(){
       for(var clean=0;clean<pieceUp.length;clean++){
           pieceDown[clean].alpha=0;
           pieceLeft[clean].alpha=0;
           pieceUp[clean].alpha=0;
           pieceDownActive[clean]=false;
           pieceUpActive[clean]=false;
           pieceLeftActive[clean]=false;
           if(pieceDownTween[clean]){
            pieceDownTween[clean].stop();
           }
           if(pieceUpTween[clean]){
            pieceUpTween[clean].stop();
           }
           if(pieceLeftTween[clean]){
            pieceLeftTween[clean].stop();
           }
       }
        start=false;
        sound.play("cheers");
        counter=0;
        countDowns=0;
        countLefts=0;
        countUps=0;
        if(actual===0){
            Mexican.stop();
            Coin(dancerM,pointsBar,100);
            game.add.tween(dancerM).to({x:game.world.width+200},900,Phaser.Easing.Cubic.Linear,true).onComplete.add(function(){
                dancerM.alpha=0;
                dancerM.x=game.world.centerX;
                if(speed>15){
                    speed-=5;
                }
                choosePiece();
                
            });
        }else if(actual===1){
            Coin(dancerJ,pointsBar,100);
            Japanese.stop();
            game.add.tween(dancerJ).to({x:game.world.width+200},900,Phaser.Easing.Cubic.Linear,true).onComplete.add(function(){
                dancerJ.alpha=0;
                dancerJ.x=game.world.centerX;
                if(speed>15){
                    speed-=5;
                }
                choosePiece();
            });
        }else if(actual===2){
            Coin(dancerC,pointsBar,100);
            Corean.stop();
            game.add.tween(dancerC).to({x:game.world.width+200},900,Phaser.Easing.Cubic.Linear,true).onComplete.add(function(){
                dancerC.alpha=0;
                dancerC.x=game.world.centerX;
                if(speed>15){
                    speed-=5;
                }
                choosePiece();
            });
        }else if(actual===3){
            Coin(dancerA,pointsBar,100);
            American.stop();
            game.add.tween(dancerA).to({x:game.world.width+200},900,Phaser.Easing.Cubic.Linear,true).onComplete.add(function(){
                dancerA.alpha=0;
                dancerA.x=game.world.centerX;
                if(speed>15){
                    speed-=5;
                }
                choosePiece();
            });
        }
        
    }
    
    function createPieces(){
        
        var pieceToChoose=game.rnd.integerInRange(0,2);
        if(pieceToChoose==0 && countUps<15){
            pieceSpot=game.rnd.integerInRange(0,14);
            
            while(pieceUpActive[pieceSpot]){
                metronome=0;
                  pieceSpot=game.rnd.integerInRange(0,14);
            }
            if(!pieceUpActive[pieceSpot]){
                countUps++;
                pieceUpActive[pieceSpot]=true;
                pieceUp[pieceSpot].alpha=1;
                pieceUp[pieceSpot].x=board.x+210;
                pieceUp[pieceSpot].y=game.world.height-165; 
                pieceUp[pieceSpot].alpha=1
                pieceUpTween[pieceSpot]=game.add.tween(pieceUp[pieceSpot]).to({x:0},speed+tempo[actual]*3,Phaser.Easing.Cubic.Linear,true)
            }
        }else if(pieceToChoose==1 && countLefts<15){
            pieceSpot2=game.rnd.integerInRange(0,14);
            
            while(pieceLeftActive[pieceSpot2]){
                metronome=0;
                  pieceSpot2=game.rnd.integerInRange(0,14);
            }
            if(!pieceLeftActive[pieceSpot2]){
                countLefts++;
                pieceLeftActive[pieceSpot2]=true;
                pieceLeft[pieceSpot2].alpha=1;
                pieceLeft[pieceSpot2].x=board.x+210;
                pieceLeft[pieceSpot2].y=game.world.height-120;
                pieceLeft[pieceSpot2].alpha=1
                pieceLeftTween[pieceSpot2]=game.add.tween(pieceLeft[pieceSpot2]).to({x:0},speed+tempo[actual]*3,Phaser.Easing.Cubic.Linear,true)
            }
        }else if(pieceToChoose==2 && countDowns<15){
            
            pieceSpot3=game.rnd.integerInRange(0,14);
            
            while(pieceDownActive[pieceSpot3]){
                metronome=0;
                  pieceSpot3=game.rnd.integerInRange(0,14);
            }
            
            if(!pieceDownActive[pieceSpot3]){
                countDowns++;
                pieceDownActive[pieceSpot3]=true;
                pieceDown[pieceSpot3].alpha=1;
                pieceDown[pieceSpot3].x=board.x+210;
                pieceDown[pieceSpot3].y=game.world.height-75;
                pieceDown[pieceSpot3].alpha=1
                pieceDownTween[pieceSpot3]=game.add.tween(pieceDown[pieceSpot3]).to({x:0},speed+tempo[actual]*3,Phaser.Easing.Cubic.Linear,true)
                }
                
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
                addPoint(5)
            })
        })
    }
    function checkOverlap(spriteA, spriteB) {

            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();

            return Phaser.Rectangle.intersects(boundsA, boundsB);

        }
    
	function update(){
        
        epicparticles.update()
        if(start){
        if(startGame){
            metronome++
            if(metronome>=speed && lives!=0){
                createPieces();
                metronome=0;
            }
            
                for(var check=0; check<pieceDown.length;check++){
                    if(checkOverlap(lose,pieceDown[check]) && lives!=0){
                        missPoint();
                        pieceDown[check].alpha=0;
                        pieceDownTween[check].stop();
                        pieceDown[check].y=0;
                        pieceDownActive[check]=false;
                        if(lives===0){
                            if(actual===0){
                                dancerM.setAnimationByName(0,"lose",true);
                            }else if(actual===1){
                                dancerJ.setAnimationByName(0,"lose",true);
                            }else if(actual===2){
                                dancerC.setAnimationByName(0,"lose",true);
                            }else if(actual===3){
                                dancerA.setAnimationByName(0,"lose",true);
                            }
                        }else{
                            if(actual===0){
                                dancerM.setAnimationByName(0,"bad",false);
                            }else if(actual===1){
                                dancerJ.setAnimationByName(0,"bad",false);
                            }else if(actual===2){
                                dancerC.setAnimationByName(0,"bad",false);
                            }else if(actual===3){
                                dancerA.setAnimationByName(0,"bad",false);
                            }
                            game.time.events.add(600,function(){
                            if(actual===0){
                                dancerM.setAnimationByName(0,"dance",true);
                            }else if(actual===1){
                                dancerJ.setAnimationByName(0,"dance",true);
                            }else if(actual===2){
                                dancerC.setAnimationByName(0,"dance",true);
                            }else if(actual===3){
                                dancerA.setAnimationByName(0,"dance",true);
                            }
                            })
                        }
                        
                    }else if(checkOverlap(lose,pieceDown[check]) && lives===0){
                        pieceDown[check].alpha=0;
                    }
                    if(checkOverlap(lose,pieceUp[check]) && lives!=0){
                        missPoint();
                        pieceUp[check].alpha=0;
                        pieceUpTween[check].stop();
                        pieceUp[check].y=0;
                        pieceUpActive[check]=false;
                        if(lives===0){
                            if(actual===0){
                                dancerM.setAnimationByName(0,"lose",true);
                            }else if(actual===1){
                                dancerJ.setAnimationByName(0,"lose",true);
                            }else if(actual===2){
                                dancerC.setAnimationByName(0,"lose",true);
                            }else if(actual===3){
                                dancerA.setAnimationByName(0,"lose",true);
                            }
                        }else{
                            if(actual===0){
                                dancerM.setAnimationByName(0,"bad",false);
                            }else if(actual===1){
                                dancerJ.setAnimationByName(0,"bad",false);
                            }else if(actual===2){
                                dancerC.setAnimationByName(0,"bad",false);
                            }else if(actual===3){
                                dancerA.setAnimationByName(0,"bad",false);
                            }
                             game.time.events.add(600,function(){
                            if(actual===0){
                                dancerM.setAnimationByName(0,"dance",true);
                            }else if(actual===1){
                                dancerJ.setAnimationByName(0,"dance",true);
                            }else if(actual===2){
                                dancerC.setAnimationByName(0,"dance",true);
                            }else if(actual===3){
                                dancerA.setAnimationByName(0,"dance",true);
                            }
                            })
                        }
                       
                    }else if(checkOverlap(lose,pieceUp[check]) && lives===0){
                        pieceUp[check].alpha=0;
                    }
                    if(checkOverlap(lose,pieceLeft[check]) && lives!=0){
                        missPoint();
                        
                        pieceLeft[check].alpha=0;
                        pieceLeftTween[check].stop();
                        pieceLeft[check].y=0;
                        pieceLeftActive[check]=false;
                        if(lives===0){
                            if(actual===0){
                                dancerM.setAnimationByName(0,"lose",true);
                            }else if(actual===1){
                                dancerJ.setAnimationByName(0,"lose",true);
                            }else if(actual===2){
                                dancerC.setAnimationByName(0,"lose",true);
                            }else if(actual===3){
                                dancerA.setAnimationByName(0,"lose",true);
                            }
                        }else{
                            if(actual===0){
                                dancerM.setAnimationByName(0,"bad",false);
                            }else if(actual===1){
                                dancerJ.setAnimationByName(0,"bad",false);
                            }else if(actual===2){
                                dancerC.setAnimationByName(0,"bad",false);
                            }else if(actual===3){
                                dancerA.setAnimationByName(0,"bad",false);
                            }
                            game.time.events.add(600,function(){
                            if(actual===0){
                                dancerM.setAnimationByName(0,"dance",true);
                            }else if(actual===1){
                                dancerJ.setAnimationByName(0,"dance",true);
                            }else if(actual===2){
                                dancerC.setAnimationByName(0,"dance",true);
                            }else if(actual===3){
                                dancerA.setAnimationByName(0,"dance",true);
                            }
                            })
                        }
                        
                    }else if(checkOverlap(lose,pieceLeft[check]) && lives===0){
                        pieceLeft[check].alpha=0;
                    }
                }
            }
            
        }

	}
    
    function choosePiece(){
        
        piece=game.rnd.integerInRange(1,4);
        
        if(piece===1){
            dancerM.alpha=1;
            dancerM.x=-300
            Mexican = sound.play("Mex", {loop:false, volume:0.6})
            buttons.getButton(Mexican,sceneGroup)
            game.add.tween(dancerM).to({x:game.world.centerX},900,Phaser.Easing.Cubic.Linear,true).onComplete.add(function(){
                actual=0;
                start=true;
            })
        }else if(piece===2){
            dancerJ.alpha=1;
            dancerJ.x=-300
            Japanese = sound.play("Jap", {loop:false, volume:0.6})
            buttons.getButton(Japanese,sceneGroup)
            game.add.tween(dancerJ).to({x:game.world.centerX},900,Phaser.Easing.Cubic.Linear,true).onComplete.add(function(){
                actual=1;
                start=true;
            })
        }else if(piece===3){
            dancerC.alpha=1;
            dancerC.x=-300
            Corean = sound.play("Cor", {loop:false, volume:0.6})
            buttons.getButton(Corean,sceneGroup)
            game.add.tween(dancerC).to({x:game.world.centerX},900,Phaser.Easing.Cubic.Linear,true).onComplete.add(function(){
                actual=2;
                start=true;
            })
        }else if(piece===4){
            dancerA.alpha=1;
            dancerA.x=-300
            American = sound.play("Ame", {loop:false, volume:0.6})
            buttons.getButton(American,sceneGroup)
            game.add.tween(dancerA).to({x:game.world.centerX},900,Phaser.Easing.Cubic.Linear,true).onComplete.add(function(){
                actual=3;
                start=true;
            })
        }
    }
    
    function strum(obj){
        
        
        for(var check=0; check<pieceDown.length;check++){
                if(checkOverlap(goalProxy,pieceDown[check])){
                    counter++
                    sound.play("point");
                    pieceDown[check].alpha=0;
                    pieceDownTween[check].stop();
                    pieceDown[check].y=0;
                    pieceDownActive[check]=false;
                    if(counter%10===0){
                        passEscenario()
                    }
                }
                if(checkOverlap(goalProxy,pieceUp[check])){
                    counter++
                     sound.play("point");
                    pieceUp[check].alpha=0;
                    pieceUpTween[check].stop();
                    pieceUp[check].y=0;
                    pieceUpActive[check]=false;
                    if(counter%10===0){
                        passEscenario()
                    }
                }
                if(checkOverlap(goalProxy,pieceLeft[check])){
                    counter++
                     sound.play("point");
                    pieceLeft[check].alpha=0;
                    pieceLeftTween[check].stop();
                    pieceLeft[check].y=0;
                    pieceLeftActive[check]=false;
                    if(counter%10===0){
                        passEscenario()
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
        particle.makeParticles('atlas.Yfactor',key);
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

				particle.makeParticles('atlas.Yfactor',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.Yfactor','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.Yfactor','smoke');
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
		name: "Yfactor",
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
            initialize()
            
                 			
            Mexican = game.add.audio('Mex')
            game.sound.setDecodedCallback(Mexican, function(){
                Mexican.loopFull(0.6)
            }, this);
                
            Japanese = game.add.audio('Jap')
            game.sound.setDecodedCallback(Japanese, function(){
                Japanese.loopFull(0.6)
            }, this);
                
            Corean = game.add.audio('Cor')
            game.sound.setDecodedCallback(Corean, function(){
                Corean.loopFull(0.6)
            }, this);
                
            American = game.add.audio('Ame')
            game.sound.setDecodedCallback(American, function(){
                American.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
                

			createPointsBar()
			createHearts()
            createTutorial()
			
			//buttons.getButton(American,sceneGroup)
//			buttons.getButton(Mexican,sceneGroup)
//			buttons.getButton(Corean,sceneGroup)
//			buttons.getButton(Japanese,sceneGroup)
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()