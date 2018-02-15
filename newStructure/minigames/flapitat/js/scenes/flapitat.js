
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var tutorialPath = "../../shared/minigames/"
var flapitat = function(){
    
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
                name: "atlas.flapitat",
                json: "images/flapitat/atlas.json",
                image: "images/flapitat/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/flapitat/timeAtlas.json",
                image: "images/flapitat/timeAtlas.png",
            },
        ],
        images: [
            
            {
				name:'tutorial_image',
				file:"images/flapitat/tutorial_image_%input.png"
			}

		],
        spines: [
            {
                name:"bookS",
                file:"images/Spine/savanna/savanna.json",
            },
            {
                name:"bookD",
                file:"images/Spine/desert/desert.json",
            },
            {
                name:"bookF",
                file:"images/Spine/forest/forest.json",
            },
            {
                name:"bookJ",
                file:"images/Spine/jungle/jungle.json",
            },
            {
                name:"AnimS",
                file:"images/Spine/jungle/savanna_animals.json",
            },
            {
                name:"AnimD",
                file:"images/Spine/jungle/desert_animals.json",
            },
            {
                name:"AnimF",
                file:"images/Spine/jungle/forest_animals.json",
            },
            {
                name:"AnimJ",
                file:"images/Spine/jungle/jungle_animals.json",
            }
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
            {   name:"flapiSong",
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
	var indexGame
    var overlayGroup
    var baseSong
    
    var actualScenario
    var tagToWin
    var fourAnimalsToChoose=new Array(4)
    var threeAnimalsInStage=new Array(3)
    var allAnimals=new Array(12)
    var animalsActive=new Array(12)
    var actualBook
    
    var backgroundGroup=null
    
    var tweenTiempo
    var clock, timeBar
    var animalsToPut,animalsOverall
    var emitter
    var choosedPos,choosedPos2,choosedPos3,choosedPos4

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){
        game.stage.backgroundColor = "#000000";
        lives = 3;
        emitter="";
        animalsToPut=1;
        loadSounds();
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.flapitat','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.flapitat','life_box')

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
        spineGroup=game.add.group()
        sceneGroup.add(spineGroup)
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        // Background
        
        backGTile=game.add.tileSprite(0,0,game.world.width,game.world.height,"atlas.flapitat","BG_TILE");
        backgroundGroup.add(backGTile);
        
        board=game.add.tileSprite(0,game.world.height-200,game.world.width,200,"atlas.flapitat","BOARD");
        backgroundGroup.add(board);
        
        // Book
        
            book=game.add.spine(game.world.centerX,game.world.centerY+250,"bookS")
            book.setSkinByName("normal");
            book.setAnimationByName(0,"IDLE",true)
            book.alpha=0
            
            book2=game.add.spine(game.world.centerX,game.world.centerY+250,"bookD")
            book2.setSkinByName("normal");
            book2.setAnimationByName(0,"IDLE",true)
            spineGroup.add(book2)
            book2.alpha=0
        
            book3=game.add.spine(game.world.centerX,game.world.centerY+250,"bookF")
            book3.setSkinByName("normal");
            book3.setAnimationByName(0,"IDLE",true)
            spineGroup.add(book3)
            book3.alpha=0
            
            book4=game.add.spine(game.world.centerX,game.world.centerY+250,"bookJ")
            book4.setSkinByName("normal");
            book4.setAnimationByName(0,"IDLE",true)
            spineGroup.add(book4)
            book4.alpha=0
            
        
        //Aqui pongo el proxy del escenario
        
            scenarioProxy=game.add.sprite(game.world.centerX,game.world.centerY+120,"atlas.flapitat","hola");
            scenarioProxy.anchor.setTo(0.5,0.5)
            scenarioProxy.scale.setTo(4,4)
            scenarioProxy.alpha=0
            
        
        //Aqui escojo cual comienza, esta va a ser una funcion para ser llamada varias veces
            
            chooseScenario();
        
        
        //Aqui inicializo a los animalitos
        
        allAnimals[0]=game.add.sprite(100,100,"atlas.flapitat","ELEPHANT");
        allAnimals[0].tag="Savanna"
        allAnimals[0].alpha=0
        allAnimals[1]=game.add.sprite(100,100,"atlas.flapitat","HIPPO");
        allAnimals[1].tag="Savanna"
        allAnimals[1].alpha=0
        allAnimals[2]=game.add.sprite(100,100,"atlas.flapitat","LION");
        allAnimals[2].tag="Savanna"
        allAnimals[2].alpha=0
        
        allAnimals[3]=game.add.sprite(100,100,"atlas.flapitat","CAMEL");
        allAnimals[3].tag="Desert"
        allAnimals[3].alpha=0
        allAnimals[4]=game.add.sprite(100,100,"atlas.flapitat","SCORPION");
        allAnimals[4].tag="Desert"
        allAnimals[4].alpha=0
        allAnimals[5]=game.add.sprite(100,100,"atlas.flapitat","SNAKE");
        allAnimals[5].tag="Desert"
        allAnimals[5].alpha=0
        
        allAnimals[6]=game.add.sprite(100,100,"atlas.flapitat","BEAR");
        allAnimals[6].tag="Forest"
        allAnimals[6].alpha=0
        allAnimals[7]=game.add.sprite(100,100,"atlas.flapitat","DEER");
        allAnimals[7].tag="Forest"
        allAnimals[7].alpha=0
        allAnimals[8]=game.add.sprite(100,100,"atlas.flapitat","WOLF");
        allAnimals[8].tag="Forest"
        allAnimals[8].alpha=0
        
        
        allAnimals[9]=game.add.sprite(100,100,"atlas.flapitat","MONKEY");
        allAnimals[9].tag="Jungle"
        allAnimals[9].alpha=0
        allAnimals[10]=game.add.sprite(100,100,"atlas.flapitat","PANTERA");
        allAnimals[10].tag="Jungle"
        allAnimals[10].alpha=0
        allAnimals[11]=game.add.sprite(100,100,"atlas.flapitat","TOUCAN");
        allAnimals[11].tag="Jungle"
        allAnimals[11].alpha=0
        
        //Aqui coloco a los animales que estaran disponibles para el book
        
        for(var forPick=0; forPick<4; forPick++){
            fourAnimalsToChoose[forPick]=game.add.sprite(game.world.centerX-140*forPick+210,game.world.height-100,"atlas.flapitat","BEAR")
            fourAnimalsToChoose[forPick].inputEnabled=true;
            fourAnimalsToChoose[forPick].scale.setTo(0.7,0.7)
            fourAnimalsToChoose[forPick].anchor.setTo(0.5,0.5)
            fourAnimalsToChoose[forPick].input.enableDrag(true);
            fourAnimalsToChoose[forPick].events.onDragStop.add(onDragStop, this);
            spineGroup.add(fourAnimalsToChoose[forPick])
        }
        animalsToPut=1
        chooseCorrectAnimals()

        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
    }
    
    function onDragStop(obj){
        
        for(var check=0;check<4;check++){
            if(checkOverlap(fourAnimalsToChoose[check],scenarioProxy) && fourAnimalsToChoose[check].alpha==1){
                if(scenarioProxy.tag==fourAnimalsToChoose[check].tag){
                    Coin(fourAnimalsToChoose[check],pointsBar,70);
                    fourAnimalsToChoose[check].inputEnabled=false
                    fourAnimalsToChoose[check].alpha=0
                    //Aqui ira el cambio de spine
                }else{
                    missPoint()
                }
            }
        }
    }
    
     //funcion para checar si sprites estan colicionando
     function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    }
    
	function chooseCorrectAnimals(){
        //animals to put
        //primer voy a meter la cantidad de animales correctos en el juego
        
        randAnimal1=0
        randAnimal2=0
        randAnimal3=0
        
        choosedPos=game.rnd.integerInRange(0,3);
        choosedPos2=game.rnd.integerInRange(0,3);
        choosedPos3=game.rnd.integerInRange(0,3);
        choosedPos4=game.rnd.integerInRange(0,3);
        
        console.log(choosedPos,choosedPos2,choosedPos3,choosedPos4)
        
        while(choosedPos==choosedPos2 || choosedPos==choosedPos3 || choosedPos==choosedPos4 || choosedPos2==choosedPos3 || choosedPos2==choosedPos4 || choosedPos3==choosedPos4){
            choosedPos=game.rnd.integerInRange(0,3);
            choosedPos2=game.rnd.integerInRange(0,3);
            choosedPos3=game.rnd.integerInRange(0,3);
            choosedPos4=game.rnd.integerInRange(0,3);
            console.log("entro")
            if(choosedPos!=choosedPos2 && choosedPos!=choosedPos3 && choosedPos!=choosedPos4 && choosedPos2!=choosedPos3 && choosedPos2!=choosedPos4 && choosedPos3!=choosedPos4){
                chooseCorrectAnimalsSecondPart()
            }
        }
        if(choosedPos!=choosedPos2 && choosedPos!=choosedPos3 && choosedPos!=choosedPos4 && choosedPos2!=choosedPos3 && choosedPos2!=choosedPos4 && choosedPos3!=choosedPos4){
                chooseCorrectAnimalsSecondPart()
            }
    }
    
    
    function chooseCorrectAnimalsSecondPart(){
        
        if(scenarioNumber==0){

                if(animalsToPut==1){
                    while(randAnimal1==randAnimal2 || randAnimal1==randAnimal3 || randAnimal2==randAnimal3 || randAnimal1==0 || randAnimal2==0 || randAnimal3==0){
                        randAnimal1=game.rnd.integerInRange(0,11)
                        randAnimal2=game.rnd.integerInRange(0,11)
                        randAnimal3=game.rnd.integerInRange(0,11)
                        fourAnimalsToChoose[choosedPos].loadTexture("atlas.flapitat",allAnimals[0]._frame.name);
                        fourAnimalsToChoose[choosedPos2].loadTexture("atlas.flapitat",allAnimals[randAnimal1]._frame.name);
                        fourAnimalsToChoose[choosedPos3].loadTexture("atlas.flapitat",allAnimals[randAnimal2]._frame.name);
                        fourAnimalsToChoose[choosedPos4].loadTexture("atlas.flapitat",allAnimals[randAnimal3]._frame.name);
                        fourAnimalsToChoose[choosedPos].tag=allAnimals[0].tag
                        fourAnimalsToChoose[choosedPos2].tag=allAnimals[randAnimal1].tag
                        fourAnimalsToChoose[choosedPos3].tag=allAnimals[randAnimal2].tag
                        fourAnimalsToChoose[choosedPos4].tag=allAnimals[randAnimal3].tag
                    }
                }else
                if(animalsToPut==2){
                    while(randAnimal2==randAnimal3 || randAnimal2==0 || randAnimal3==0 || randAnimal2==1 || randAnimal3==1){
                        randAnimal2=game.rnd.integerInRange(0,11)
                        randAnimal3=game.rnd.integerInRange(0,11)
                        fourAnimalsToChoose[choosedPos].loadTexture("atlas.flapitat",allAnimals[0]._frame.name);
                        fourAnimalsToChoose[choosedPos2].loadTexture("atlas.flapitat",allAnimals[1]._frame.name);
                        fourAnimalsToChoose[choosedPos3].loadTexture("atlas.flapitat",allAnimals[randAnimal2]._frame.name);
                        fourAnimalsToChoose[choosedPos4].loadTexture("atlas.flapitat",allAnimals[randAnimal3]._frame.name);
                        fourAnimalsToChoose[choosedPos].tag=allAnimals[0].tag
                        fourAnimalsToChoose[choosedPos2].tag=allAnimals[1].tag
                        fourAnimalsToChoose[choosedPos3].tag=allAnimals[randAnimal2].tag
                        fourAnimalsToChoose[choosedPos4].tag=allAnimals[randAnimal3].tag
                    }

                }else
                if(animalsToPut==3){
                    while(randAnimal3==0 || randAnimal3==1 || randAnimal3==2){
                        randAnimal3=game.rnd.integerInRange(0,11)
                        fourAnimalsToChoose[choosedPos].loadTexture("atlas.flapitat",allAnimals[0]._frame.name);
                        fourAnimalsToChoose[choosedPos2].loadTexture("atlas.flapitat",allAnimals[1]._frame.name);
                        fourAnimalsToChoose[choosedPos3].loadTexture("atlas.flapitat",allAnimals[2]._frame.name);
                        fourAnimalsToChoose[choosedPos4].loadTexture("atlas.flapitat",allAnimals[randAnimal3]._frame.name);
                        fourAnimalsToChoose[choosedPos].tag=allAnimals[0].tag
                        fourAnimalsToChoose[choosedPos2].tag=allAnimals[1].tag
                        fourAnimalsToChoose[choosedPos3].tag=allAnimals[2].tag
                        fourAnimalsToChoose[choosedPos4].tag=allAnimals[randAnimal3].tag
                    }
                }

            }
            if(scenarioNumber==1){

                if(animalsToPut==1){
                    while(randAnimal1==randAnimal2 || randAnimal1==randAnimal3 || randAnimal2==randAnimal3 || randAnimal1==3 || randAnimal2==3 || randAnimal3==3){
                        randAnimal1=game.rnd.integerInRange(0,11)
                        randAnimal2=game.rnd.integerInRange(0,11)
                        randAnimal3=game.rnd.integerInRange(0,11)
                        fourAnimalsToChoose[choosedPos].loadTexture("atlas.flapitat",allAnimals[3]._frame.name);
                        fourAnimalsToChoose[choosedPos2].loadTexture("atlas.flapitat",allAnimals[randAnimal1]._frame.name);
                        fourAnimalsToChoose[choosedPos3].loadTexture("atlas.flapitat",allAnimals[randAnimal2]._frame.name);
                        fourAnimalsToChoose[choosedPos4].loadTexture("atlas.flapitat",allAnimals[randAnimal3]._frame.name);
                        fourAnimalsToChoose[choosedPos].tag=allAnimals[3].tag
                        fourAnimalsToChoose[choosedPos2].tag=allAnimals[randAnimal1].tag
                        fourAnimalsToChoose[choosedPos3].tag=allAnimals[randAnimal2].tag
                        fourAnimalsToChoose[choosedPos4].tag=allAnimals[randAnimal3].tag
                    }
                }else
                if(animalsToPut==2){
                    while(randAnimal2==randAnimal3 || randAnimal2==3 || randAnimal3==3 || randAnimal2==4 || randAnimal3==4){
                        randAnimal2=game.rnd.integerInRange(0,11)
                        randAnimal3=game.rnd.integerInRange(0,11)
                        fourAnimalsToChoose[choosedPos].loadTexture("atlas.flapitat",allAnimals[3]._frame.name);
                        fourAnimalsToChoose[choosedPos2].loadTexture("atlas.flapitat",allAnimals[4]._frame.name);
                        fourAnimalsToChoose[choosedPos3].loadTexture("atlas.flapitat",allAnimals[randAnimal2]._frame.name);
                        fourAnimalsToChoose[choosedPos4].loadTexture("atlas.flapitat",allAnimals[randAnimal3]._frame.name);
                        fourAnimalsToChoose[choosedPos].tag=allAnimals[3].tag
                        fourAnimalsToChoose[choosedPos2].tag=allAnimals[4].tag
                        fourAnimalsToChoose[choosedPos3].tag=allAnimals[randAnimal2].tag
                        fourAnimalsToChoose[choosedPos4].tag=allAnimals[randAnimal3].tag
                    }
                }else
                if(animalsToPut==3){
                    while(randAnimal3==3 || randAnimal3==4 || randAnimal3==5){
                        randAnimal3=game.rnd.integerInRange(0,11)
                        fourAnimalsToChoose[choosedPos].loadTexture("atlas.flapitat",allAnimals[3]._frame.name);
                        fourAnimalsToChoose[choosedPos2].loadTexture("atlas.flapitat",allAnimals[4]._frame.name);
                        fourAnimalsToChoose[choosedPos3].loadTexture("atlas.flapitat",allAnimals[5]._frame.name);
                        fourAnimalsToChoose[choosedPos4].loadTexture("atlas.flapitat",allAnimals[randAnimal3]._frame.name);
                        fourAnimalsToChoose[choosedPos].tag=allAnimals[3].tag
                        fourAnimalsToChoose[choosedPos2].tag=allAnimals[4].tag
                        fourAnimalsToChoose[choosedPos3].tag=allAnimals[5].tag
                        fourAnimalsToChoose[choosedPos4].tag=allAnimals[randAnimal3].tag
                    }
                }


            }
            if(scenarioNumber==2){

                if(animalsToPut==1){
                    while(randAnimal1==randAnimal2 || randAnimal1==randAnimal3 || randAnimal2==randAnimal3 || randAnimal1==6 || randAnimal2==6 || randAnimal3==6){
                        randAnimal1=game.rnd.integerInRange(0,11)
                        randAnimal2=game.rnd.integerInRange(0,11)
                        randAnimal3=game.rnd.integerInRange(0,11)
                        fourAnimalsToChoose[choosedPos].loadTexture("atlas.flapitat",allAnimals[6]._frame.name);
                        fourAnimalsToChoose[choosedPos2].loadTexture("atlas.flapitat",allAnimals[randAnimal1]._frame.name);
                        fourAnimalsToChoose[choosedPos3].loadTexture("atlas.flapitat",allAnimals[randAnimal2]._frame.name);
                        fourAnimalsToChoose[choosedPos4].loadTexture("atlas.flapitat",allAnimals[randAnimal3]._frame.name);
                        fourAnimalsToChoose[choosedPos].tag=allAnimals[6].tag
                        fourAnimalsToChoose[choosedPos2].tag=allAnimals[randAnimal1].tag
                        fourAnimalsToChoose[choosedPos3].tag=allAnimals[randAnimal2].tag
                        fourAnimalsToChoose[choosedPos4].tag=allAnimals[randAnimal3].tag
                    }
                }else
                if(animalsToPut==2){
                    while(randAnimal2==randAnimal3 || randAnimal2==6 || randAnimal3==6 || randAnimal2==7 || randAnimal3==7){
                        randAnimal2=game.rnd.integerInRange(0,11)
                        randAnimal3=game.rnd.integerInRange(0,11)
                        fourAnimalsToChoose[choosedPos].loadTexture("atlas.flapitat",allAnimals[6]._frame.name);
                        fourAnimalsToChoose[choosedPos2].loadTexture("atlas.flapitat",allAnimals[7]._frame.name);
                        fourAnimalsToChoose[choosedPos3].loadTexture("atlas.flapitat",allAnimals[randAnimal2]._frame.name);
                        fourAnimalsToChoose[choosedPos4].loadTexture("atlas.flapitat",allAnimals[randAnimal3]._frame.name);
                        fourAnimalsToChoose[choosedPos].tag=allAnimals[6].tag
                        fourAnimalsToChoose[choosedPos2].tag=allAnimals[7].tag
                        fourAnimalsToChoose[choosedPos3].tag=allAnimals[randAnimal2].tag
                        fourAnimalsToChoose[choosedPos4].tag=allAnimals[randAnimal3].tag
                    }
                }else
                if(animalsToPut==3){
                    while(randAnimal3==6 || randAnimal3==7 || randAnimal3==8){
                        randAnimal3=game.rnd.integerInRange(0,11)
                        fourAnimalsToChoose[choosedPos].loadTexture("atlas.flapitat",allAnimals[6]._frame.name);
                        fourAnimalsToChoose[choosedPos2].loadTexture("atlas.flapitat",allAnimals[7]._frame.name);
                        fourAnimalsToChoose[choosedPos3].loadTexture("atlas.flapitat",allAnimals[8]._frame.name);
                        fourAnimalsToChoose[choosedPos4].loadTexture("atlas.flapitat",allAnimals[randAnimal3]._frame.name);
                        fourAnimalsToChoose[choosedPos].tag=allAnimals[6].tag
                        fourAnimalsToChoose[choosedPos2].tag=allAnimals[7].tag
                        fourAnimalsToChoose[choosedPos3].tag=allAnimals[8].tag
                        fourAnimalsToChoose[choosedPos4].tag=allAnimals[randAnimal3].tag
                    }
                }

            }
            if(scenarioNumber==3){

                if(animalsToPut==1){
                     while(randAnimal1==randAnimal2 || randAnimal1==randAnimal3 || randAnimal2==randAnimal3 || randAnimal1==9 || randAnimal2==9 || randAnimal3==9){
                        randAnimal1=game.rnd.integerInRange(0,11)
                        randAnimal2=game.rnd.integerInRange(0,11)
                        randAnimal3=game.rnd.integerInRange(0,11)
                        fourAnimalsToChoose[choosedPos].loadTexture("atlas.flapitat",allAnimals[9]._frame.name);
                        fourAnimalsToChoose[choosedPos2].loadTexture("atlas.flapitat",allAnimals[randAnimal1]._frame.name);
                        fourAnimalsToChoose[choosedPos3].loadTexture("atlas.flapitat",allAnimals[randAnimal2]._frame.name);
                        fourAnimalsToChoose[choosedPos4].loadTexture("atlas.flapitat",allAnimals[randAnimal3]._frame.name);
                        fourAnimalsToChoose[choosedPos].tag=allAnimals[9].tag
                        fourAnimalsToChoose[choosedPos2].tag=allAnimals[randAnimal1].tag
                        fourAnimalsToChoose[choosedPos3].tag=allAnimals[randAnimal2].tag
                        fourAnimalsToChoose[choosedPos4].tag=allAnimals[randAnimal3].tag
                         
                    }
                }else
                if(animalsToPut==2){
                    while(randAnimal2==randAnimal3 || randAnimal2==9 || randAnimal3==9 || randAnimal2==10 || randAnimal3==10){
                        randAnimal2=game.rnd.integerInRange(0,11)
                        randAnimal3=game.rnd.integerInRange(0,11)
                        fourAnimalsToChoose[choosedPos].loadTexture("atlas.flapitat",allAnimals[9]._frame.name);
                        fourAnimalsToChoose[choosedPos2].loadTexture("atlas.flapitat",allAnimals[10]._frame.name);
                        fourAnimalsToChoose[choosedPos3].loadTexture("atlas.flapitat",allAnimals[randAnimal2]._frame.name);
                        fourAnimalsToChoose[choosedPos4].loadTexture("atlas.flapitat",allAnimals[randAnimal3]._frame.name);
                        fourAnimalsToChoose[choosedPos].tag=allAnimals[9].tag
                        fourAnimalsToChoose[choosedPos2].tag=allAnimals[10].tag
                        fourAnimalsToChoose[choosedPos3].tag=allAnimals[randAnimal2].tag
                        fourAnimalsToChoose[choosedPos4].tag=allAnimals[randAnimal3].tag
                    }
                }else
                if(animalsToPut==3){
                    while(randAnimal3==9 || randAnimal3==10 || randAnimal3==11){
                        randAnimal3=game.rnd.integerInRange(0,11)
                        fourAnimalsToChoose[choosedPos].loadTexture("atlas.flapitat",allAnimals[9]._frame.name);
                        fourAnimalsToChoose[choosedPos2].loadTexture("atlas.flapitat",allAnimals[10]._frame.name);
                        fourAnimalsToChoose[choosedPos3].loadTexture("atlas.flapitat",allAnimals[11]._frame.name);
                        fourAnimalsToChoose[choosedPos4].loadTexture("atlas.flapitat",allAnimals[randAnimal3]._frame.name);
                        fourAnimalsToChoose[choosedPos].tag=allAnimals[9].tag
                        fourAnimalsToChoose[choosedPos2].tag=allAnimals[10].tag
                        fourAnimalsToChoose[choosedPos3].tag=allAnimals[11].tag
                        fourAnimalsToChoose[choosedPos4].tag=allAnimals[randAnimal3].tag
                    }
                }
            }
        
    }
    
    function chooseScenario(){
        
        scenarioNumber=game.rnd.integerInRange(0,3);
        
        if(scenarioNumber==0){
            actualBook=game.add.spine(game.world.centerX,game.world.centerY+250,"bookS")
            actualBook.setSkinByName("normal");
            actualBook.setAnimationByName(0,"IDLE",true)
            spineGroup.add(actualBook)
            scenarioProxy.tag="Savanna"
        }
        if(scenarioNumber==1){
            actualBook=game.add.spine(game.world.centerX,game.world.centerY+250,"bookD")
            actualBook.setSkinByName("normal");
            actualBook.setAnimationByName(0,"IDLE",true)
            spineGroup.add(actualBook)
            scenarioProxy.tag="Desert"
        }
        if(scenarioNumber==2){
            actualBook=game.add.spine(game.world.centerX,game.world.centerY+250,"bookF")
            actualBook.setSkinByName("normal");
            actualBook.setAnimationByName(0,"IDLE",true)
            spineGroup.add(actualBook)
            scenarioProxy.tag="Forest"
        }
        if(scenarioNumber==3){
            actualBook=game.add.spine(game.world.centerX,game.world.centerY+250,"bookJ")
            actualBook.setSkinByName("normal");
            actualBook.setAnimationByName(0,"IDLE",true)
            spineGroup.add(actualBook)
            scenarioProxy.tag="Jungle"
        }
        
        spineGroup.add(book)
        spineGroup.add(book2)
        spineGroup.add(book3)
        spineGroup.add(book4)
    }
    
    
    function chooseNextScenario(){
        
        scenarioNumber=game.rnd.integerInRange(0,3);
        
        if(scenarioNumber==0){
           actualBook=game.add.spine(game.world.centerX,game.world.centerY+250,"bookS")
            actualBook.setSkinByName("normal");
            actualBook.setAnimationByName(0,"MOVE",true)
            spineGroup.add(actualBook)
            
            //desaparecemos animales y aparecemos entorno 
            
            //primero a los animales
            game.time.events.add(200,function(){
                threeAnimalsInStage[0].alpha=0;
                //Aqui aparezco el siguiente libro
                book.alpha=1
                game.time.events.add(200,function(){
                    threeAnimalsInStage[1].alpha=0;
                    game.time.events.add(200,function(){
                        threeAnimalsInStage[2].alpha=0;
                    })
                })
            })
        }
        if(scenarioNumber==1){
            actualBook=game.add.spine(game.world.centerX,game.world.centerY+250,"bookD")
            actualBook.setSkinByName("normal");
            actualBook.setAnimationByName(0,"MOVE",true)
            spineGroup.add(actualBook)
            
            //desaparecemos animales y aparecemos entorno 
            
            //primero a los animales
            game.time.events.add(200,function(){
                threeAnimalsInStage[0].alpha=0;
                //Aqui aparezco el siguiente libro
                book2.alpha=1
                game.time.events.add(200,function(){
                    threeAnimalsInStage[1].alpha=0;
                    game.time.events.add(200,function(){
                        threeAnimalsInStage[2].alpha=0;
                    })
                })
            })
        }
        if(scenarioNumber==2){
            actualBook=game.add.spine(game.world.centerX,game.world.centerY+250,"bookF")
            actualBook.setSkinByName("normal");
            actualBook.setAnimationByName(0,"MOVE",true)
            spineGroup.add(actualBook)
            
            //desaparecemos animales y aparecemos entorno 
            
            //primero a los animales
            game.time.events.add(200,function(){
                threeAnimalsInStage[0].alpha=0;
                //Aqui aparezco el siguiente libro
                book3.alpha=1
                game.time.events.add(200,function(){
                    threeAnimalsInStage[1].alpha=0;
                    game.time.events.add(200,function(){
                        threeAnimalsInStage[2].alpha=0;
                    })
                })
            })
        }
        if(scenarioNumber==3){
            actualBook=game.add.spine(game.world.centerX,game.world.centerY+250,"bookJ")
            actualBook.setSkinByName("normal");
            actualBook.setAnimationByName(0,"MOVE",true)
            spineGroup.add(actualBook)
            
            //desaparecemos animales y aparecemos entorno 
            
            //primero a los animales
            game.time.events.add(200,function(){
                threeAnimalsInStage[0].alpha=0;
                //Aqui aparezco el siguiente libro
                book4.alpha=1
                game.time.events.add(200,function(){
                    threeAnimalsInStage[1].alpha=0;
                    game.time.events.add(200,function(){
                        threeAnimalsInStage[2].alpha=0;
                    })
                })
            })
        }
        
        spineGroup.add(book);
        spineGroup.add(book2);
        spineGroup.add(book3);
        spineGroup.add(book4);
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
        particle.makeParticles('atlas.flapitat',key);
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

				particle.makeParticles('atlas.flapitat',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.flapitat','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.flapitat','smoke');
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
		name: "flapitat",
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
            baseSong = sound.play("flapiSong", {loop:true, volume:0.6})
                        			
            baseSong = game.add.audio('flapiSong')
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