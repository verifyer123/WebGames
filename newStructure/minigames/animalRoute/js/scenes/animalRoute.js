
var soundsPath = "../../shared/minigames/sounds/"
var animalRoute = function(){
    
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
                name: "atlas.route",
                json: "images/game/atlas.json",
                image: "images/game/atlas.png",
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
            {	name: "ship",
				file: soundsPath + "robotBeep.mp3"},
            {	name: "vacc",
				file: soundsPath + "swipe.mp3"},
            {	name: "bus",
				file: soundsPath + "carAcceleration.mp3"
            },
            {	name: "cheers",
				file: soundsPath + "cheers.mp3"
            },
            {	name: "clic",
				file: soundsPath + "click.mp3"
            },
			
		],
    }
    
        
    var lives = 3
	var sceneGroup = null
	var background
    var gameActive = true
    var gameStarted=false
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 110
	var indexGame
    var overlayGroup
    var spaceSong
    
    var backgroundGroup=null
    var tutoGroup=null
    var gameGroup=null
    var roadGroup=null
    var busGroup=null
    var animalsGroup=null
    var houseGroup=null
    var tutorialComplete=false
    

    var animals=new Array(24)
    var animalsNames=new Array(24)
    var animalsSpine=new Array(24)
    var animalsActive=new Array(24)
    var houses=new Array(4)
    var houseSpine=new Array(4)
    var housesActive=new Array(4)
    var countersHouses=new Array(4)
    var bus, wrongAnimal, wrongNumber,wrongNumber2,busSpine,scaleSpine
    var correctNumber 
    var correctNumber2
    var correctNumber3
    var correctNumber4
    
    var guideSpine
    
    var proxyTiles=new Array(4)
    var goldTiles=new Array(4)
    var scoreHouse=new Array(4)
    var scores=new Array(4)
    
    var level=null
    
    var waitingTime=null
    var howManyAnimals=null
    var busSpeed=null
    var animalSpeed=null
    var busTween
    var goal
    var dificulty,timeDificulty
    var bubble1, bubble2, bubble3, bubble4
    var initialzeScores
    var randomAnimal, randomHouse, farmLeft, zooLeft
    
    //Para el tuto
    
    var backgroundGroup_t=null, roadGroup_t, busGroup_t, houseGroupt, houseGroup2_t, houseGroup3_t, houseGroup4_t, animalsGroup_t, bubble1Group_t, bubble2Group_t, bubble3Group_t, bubble4Group_t,tutorialprob_t
    var count=0
    var manita
    var animalsSpineTuto
    var animalsSpineTuto2
    var rect,rect2,rect3,rect4
    var coins=new Array(4)
    var playButton, play
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#220341"
        lives = 3
        howManyAnimals=0
        level=1
        wrongNumber=-1
        scaleSpine=.5
        correctNumber=-1
        correctNumber2=-1
        correctNumber3=-1
        correctNumber4=-1
        farmLeft=2
        dificulty=2
        busSpeed=1950
        zooLeft=2
        goal=4
        timerBus=0
        waitingTime=10
        animalSpeed=20
        timeDificulty=50
        
        for(var cleaningArrays=0;cleaningArrays<4;cleaningArrays++){
            housesActive[cleaningArrays]=false
            countersHouses[cleaningArrays]=0
        }
         
        animals[0]=game.add.image(0,0,"atlas.route","CHICKEN")
        animals[1]=game.add.image(0,0,"atlas.route","DOG")
        animals[2]=game.add.image(0,0,"atlas.route","SHEEP")
        animals[3]=game.add.image(0,0,"atlas.route","PIG")
        animals[4]=game.add.image(0,0,"atlas.route","BULL")
        animals[5]=game.add.image(0,0,"atlas.route","HORSE")
        animals[6]=game.add.image(0,0,"atlas.route","DUCK")
        animals[7]=game.add.image(0,0,"atlas.route","COW")
        animals[8]=game.add.image(0,0,"atlas.route","RABBIT")
        animals[9]=game.add.image(0,0,"atlas.route","TURKEY")
        animals[10]=game.add.image(0,0,"atlas.route","GOAT")
        animals[11]=game.add.image(0,0,"atlas.route","LAMB")
        animals[12]=game.add.image(0,0,"atlas.route","TIGER")
        animals[13]=game.add.image(0,0,"atlas.route","TOUCAN")
        animals[14]=game.add.image(0,0,"atlas.route","ZEBRA")
        animals[15]=game.add.image(0,0,"atlas.route","MONKEY")
        animals[16]=game.add.image(0,0,"atlas.route","LEMUR")
        animals[17]=game.add.image(0,0,"atlas.route","KANGAROO")
        animals[18]=game.add.image(0,0,"atlas.route","HIPPO")
        animals[19]=game.add.image(0,0,"atlas.route","LION")
        animals[20]=game.add.image(0,0,"atlas.route","SNAKE")
        animals[21]=game.add.image(0,0,"atlas.route","CROC")
        animals[22]=game.add.image(0,0,"atlas.route","GIRAFFE")
        animals[23]=game.add.image(0,0,"atlas.route","GORILA")
        
        
        
    
        for(var scaleAnimals=0;scaleAnimals<animals.length;scaleAnimals++){
            
            animals[scaleAnimals].scale.setTo(.4)
            animalsActive[scaleAnimals]=false
            animals[scaleAnimals].alpha=0
            if(scaleAnimals<12){
                animals[scaleAnimals].name="FARM"
            }else{
                animals[scaleAnimals].name="ZOO"
            }
        }
        
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.route','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.route','life_box')

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
        
        
        
        
        spaceSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    
    function preload(){
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        
        game.load.spine('House', "images/Spine/Game elements/Farm&Zoo/farm&zoo.json");
        game.load.spine('Animals', "images/Spine/Game elements/Animals/animals.json");
        game.load.spine('Car', "images/Spine/Game elements/Car/car.json");
        
        game.load.spritesheet("manita", 'images/Spine/Tuturial Extras/manita.png', 115, 111, 23)
        game.load.spritesheet("coin", 'images/Spine/Game elements/coin/coin.png', 122, 123, 12)
        
        game.load.audio('spaceSong', soundsPath + 'songs/circus_gentlejammers.mp3');
        
		game.load.image('howTo',"images/game/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/game/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/game/introscreen.png")
        
//        game.load.spine("ship","images/Spine/ship/ship.json")
        
        
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var road
        var placedEspecial=0
        
	   backgroundGroup = game.add.group()
       roadGroup = game.add.group()
       busGroup = game.add.group()
       houseGroup = game.add.group()
       houseGroup1 = game.add.group()
       houseGroup2 = game.add.group()
       houseGroup3 = game.add.group()
       houseGroup4 = game.add.group()
       animalsGroup = game.add.group()
       bubble1Group=game.add.group()
       bubble2Group=game.add.group()
       bubble3Group=game.add.group()
       bubble4Group=game.add.group()
       sceneGroup.add(backgroundGroup)
       sceneGroup.add(roadGroup)
       sceneGroup.add(busGroup)
       sceneGroup.add(houseGroup)
       sceneGroup.add(houseGroup1)
       sceneGroup.add(houseGroup2)
       sceneGroup.add(houseGroup3)
       sceneGroup.add(houseGroup4)
       sceneGroup.add(animalsGroup)
       sceneGroup.add(bubble1Group)
       sceneGroup.add(bubble2Group)
       sceneGroup.add(bubble3Group)
       sceneGroup.add(bubble4Group)
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        //Rapida inicializaciòn
        
        
        animalsNames[0]="chiken"
        animalsNames[1]="dog"
        animalsNames[2]="sheep"
        animalsNames[3]="pig"
        animalsNames[4]="bull"
        animalsNames[5]="horse"
        animalsNames[6]="duck"
        animalsNames[7]="cow"
        animalsNames[8]="rabbit"
        animalsNames[9]="turkey"
        animalsNames[10]="goat"
        animalsNames[11]="lamb"
        animalsNames[12]="tiger"
        animalsNames[13]="toucan"
        animalsNames[14]="zebra"
        animalsNames[15]="chimpanzee"
        animalsNames[16]="monkey"
        animalsNames[17]="kanguro"
        animalsNames[18]="hippo"
        animalsNames[19]="lion"
        animalsNames[20]="snake"
        animalsNames[21]="cocodile"
        animalsNames[22]="giraffe"
        animalsNames[23]="gorilla"

        
        
        //Meto las animaciones de los animales a un arreglo
        
        for(initialzeScores=0; initialzeScores<4; initialzeScores++){
            scoreHouse[initialzeScores]=0
            scores[initialzeScores]=0
        }
        
        for(var aniSpines=0;aniSpines<animals.length;aniSpines++){
            animalsSpine[aniSpines]=game.add.spine(200,200, "Animals");
            if(aniSpines!=0 && aniSpines!=1 && aniSpines!=6 && aniSpines!=8 && aniSpines!=13 && aniSpines!=15 && aniSpines!=16 && aniSpines!=20){
                animalsSpine[aniSpines].scale.setTo(.4,.4)
            }else{
                animalsSpine[aniSpines].scale.setTo(.6,.6)  
            }
            animalsSpine[aniSpines].alpha=0
            animalsSpine[aniSpines].setSkinByName(animalsNames[aniSpines]);
            animalsSpine[aniSpines].setAnimationByName(0,"WALK",true)
            animalsGroup.add(animalsSpine[aniSpines])
        }
        
        backG=game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.route','BG')
        backgroundGroup.add(backG)
        
        for(var placeRoad=0;placeRoad<game.world.width/100;placeRoad++){
            road=game.add.image(placeRoad*100,0,"atlas.route","HORIZONTAL")
            roadGroup.add(road)
        }
        
         for(var placeRoad=1;placeRoad<game.world.height/100;placeRoad++){
            if(placeRoad==2 || placeRoad==4 || placeRoad==6 || placeRoad==8){
                proxyTiles[placedEspecial]=game.add.sprite(game.world.centerX+10,placeRoad*100+50,"atlas.route","STRAIGHT")
                goldTiles[placedEspecial]=game.add.sprite(game.world.centerX+10,placeRoad*100+50,"atlas.route","STRAIGHT")
                proxyTiles[placedEspecial].anchor.setTo(0.5,0.5)
                proxyTiles[placedEspecial].scale.setTo(0.1,0.1)
                goldTiles[placedEspecial].anchor.setTo(0.5)
                goldTiles[placedEspecial].scale.setTo(1,0.9)
                game.add.tween(goldTiles[placedEspecial].scale).to({x:1.1, y:1.1}, (600), Phaser.Easing.Cubic.Out, true).yoyo(true).loop(true)
                proxyTiles[placedEspecial].tag="STRAIGHT"
                goldTiles[placedEspecial].tag=(placeRoad/2)-1
                    if(placeRoad==2){
                        proxyTiles[placedEspecial].name="primero"
                    }
                    if(placeRoad==4){
                       proxyTiles[placedEspecial].name="segundo"
                    }
                    if(placeRoad==6){
                        proxyTiles[placedEspecial].name="tercero"
                    }
                    if(placeRoad==8){
                        proxyTiles[placedEspecial].name="cuarto"
                    }  
                goldTiles[placedEspecial].inputEnabled=true
                goldTiles[placedEspecial].events.onInputDown.add(onClick,this)
                for(var placeRoad2=0;placeRoad2<2;placeRoad2++){
                    
                    if(placeRoad==2){
                        road=game.add.image(game.world.centerX-118+placeRoad2*-50,placeRoad*100,"atlas.route","HORIZONTAL")
                        road.scale.setTo(0.5,0.85)
                        houseGroup1.add(road)
                    }
                    if(placeRoad==4){
                        road=game.add.image(game.world.centerX+68+placeRoad2*50,placeRoad*100,"atlas.route","HORIZONTAL")
                        road.scale.setTo(0.5,0.85)
                        houseGroup2.add(road)
                    }
                    if(placeRoad==6){
                        road=game.add.image(game.world.centerX-118+placeRoad2*-50,placeRoad*100,"atlas.route","HORIZONTAL")
                        road.scale.setTo(0.5,0.85)
                        houseGroup3.add(road) 
                    }
                    if(placeRoad==8){
                        road=game.add.image(game.world.centerX+68+placeRoad2*50,placeRoad*100,"atlas.route","HORIZONTAL")
                        road.scale.setTo(0.5,0.85)
                        houseGroup4.add(road) 
                    }  
                }
                
            //proxyTiles[placedEspecial].add(mouse.down)
            sceneGroup.add(goldTiles[placedEspecial])
            roadGroup.add(proxyTiles[placedEspecial])
                sceneGroup.bringToTop(animalsGroup)
            placedEspecial++
            }else{
             road=game.add.image(game.world.centerX-50,placeRoad*100,"atlas.route","VERTICAL")
             road.scale.setTo(1,0.9)
             roadGroup.add(road)
            }
             
           
        }
        
        //Aqui voy a meter las casas 
    
            houses[0]=game.add.image(game.world.centerX-270,proxyTiles[0].y-90,"atlas.route","FARM")
            houses[0].scale.setTo(.6)
            houses[0].tag="FARM"
            houseSpine[0]=game.add.spine(houses[0].centerX,houses[0].centerY+100, "House");
            houseSpine[0].scale.setTo(.7,.7)
            houseSpine[0].setSkinByName("normal");
            houseSpine[0].setAnimationByName(0,"IDLE_FARM",true) 
            houses[1]=game.add.image(game.world.centerX+170,proxyTiles[1].y-90,"atlas.route","ZOO")
            houses[1].scale.setTo(.6)
            houses[1].tag="ZOO"
            houseSpine[1]=game.add.spine(houses[1].centerX,houses[1].centerY+100, "House");
            houseSpine[1].scale.setTo(.7,.7)
            houseSpine[1].setSkinByName("normal");
            houseSpine[1].setAnimationByName(0,"IDLE_ZOO",true) 
            houses[2]=game.add.image(game.world.centerX-270,proxyTiles[2].y-90,"atlas.route","FARM")
            houses[2].scale.setTo(.6)
            houses[2].tag="FARM"
            houseSpine[2]=game.add.spine(houses[2].centerX,houses[2].centerY+100, "House");
            houseSpine[2].scale.setTo(.7,.7)
            houseSpine[2].setSkinByName("normal");
            houseSpine[2].setAnimationByName(0,"IDLE_FARM",true) 
            houses[3]=game.add.image(game.world.centerX+170,proxyTiles[3].y-90,"atlas.route","ZOO")
            houses[3].scale.setTo(.6)
            houses[3].tag="ZOO"
            houseSpine[3]=game.add.spine(houses[3].centerX,houses[3].centerY+100, "House");
            houseSpine[3].scale.setTo(.7,.7)
            houseSpine[3].setSkinByName("normal");
            houseSpine[3].setAnimationByName(0,"IDLE_ZOO",true) 
            houses[0].alpha=0
            houses[1].alpha=0
            houses[2].alpha=0
            houses[3].alpha=0
            houseGroup1.add(houses[0])
            houseGroup2.add(houses[1])
            houseGroup3.add(houses[2])
            houseGroup4.add(houses[3])
            houseGroup1.add(houseSpine[0])
            houseGroup2.add(houseSpine[1])
            houseGroup3.add(houseSpine[2])
            houseGroup4.add(houseSpine[3])
        
            houseGroup3.alpha=0
            houseGroup4.alpha=0
        
        
        //Coins
        for(var putingCoins=0;putingCoins<coins.length;putingCoins++){
            coins[putingCoins]=game.add.sprite(houses[putingCoins].x+65,houses[putingCoins].y+50, "coin")
            coins[putingCoins].anchor.setTo(.5)
            coins[putingCoins].scale.setTo(.5)
            coins[putingCoins].animations.add('coin');
            coins[putingCoins].animations.play('coin', 24, true);
            coins[putingCoins].alpha=0
        }
        
        //Bubble Groups
        
        bubble1=game.add.image(houseSpine[0].centerX,houseSpine[0].centerY-120,"atlas.route","BUBBLE")
        bubble2=game.add.image(houseSpine[1].centerX,houseSpine[1].centerY-120,"atlas.route","BUBBLE")
        bubble3=game.add.image(houseSpine[2].centerX,houseSpine[2].centerY-120,"atlas.route","BUBBLE")
        bubble4=game.add.image(houseSpine[3].centerX,houseSpine[3].centerY-120,"atlas.route","BUBBLE")
        
        bubble1.anchor.setTo(0.5)
        bubble2.anchor.setTo(0.5)
        bubble3.anchor.setTo(0.5)
        bubble4.anchor.setTo(0.5)
        
            houseGroup1.add(bubble1)
            houseGroup2.add(bubble2)
            houseGroup3.add(bubble3)
            houseGroup4.add(bubble4)
            
         game.add.tween(bubble1.scale).to({x:1.3, y:1.3}, (600), Phaser.Easing.Cubic.Out, true).yoyo(true).loop(true)
         game.add.tween(bubble2.scale).to({x:1.3, y:1.3}, (600), Phaser.Easing.Cubic.Out, true).yoyo(true).loop(true)
         game.add.tween(bubble3.scale).to({x:1.3, y:1.3}, (600), Phaser.Easing.Cubic.Out, true).yoyo(true).loop(true)
         game.add.tween(bubble4.scale).to({x:1.3, y:1.3}, (600), Phaser.Easing.Cubic.Out, true).yoyo(true).loop(true)
        
        var fontStyle = {font: "40px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
			var countText = new Phaser.Text(houseGroup1.game, 0, 10, "0", fontStyle)
			countText.x = bubble1.centerX
			countText.y = bubble1.centerY-10
            countText.anchor.setTo(0.5)
			countText.setText(scores[0])
			houseGroup1.add(countText)
			houseGroup1.text = countText
        
        var countText2 = new Phaser.Text(houseGroup2.game, 0, 10, "0", fontStyle)
			countText2.x = bubble2.centerX
			countText2.y = bubble2.centerY-10
            countText2.anchor.setTo(0.5)
			countText2.setText(scores[1])
			houseGroup2.add(countText2)
			houseGroup2.text = countText2
        
        var countText3 = new Phaser.Text(houseGroup3.game, 0, 10, "0", fontStyle)
			countText3.x = bubble3.centerX
			countText3.y = bubble3.centerY-10
            countText3.anchor.setTo(0.5)
			countText3.setText(scores[2])
			houseGroup3.add(countText3)
			houseGroup3.text = countText3
        
        var countText4 = new Phaser.Text(houseGroup4.game, 0, 10, "0", fontStyle)
			countText4.x = bubble4.centerX
			countText4.y = bubble4.centerY-10
            countText4.anchor.setTo(0.5)
			countText4.setText(scores[3])
			houseGroup4.add(countText4)
			houseGroup4.text = countText4
			
        
        
        
         game.add.tween(countText.scale).to({x:1.3, y:1.3}, (600), Phaser.Easing.Cubic.Out, true).yoyo(true).loop(true)
         game.add.tween(countText2.scale).to({x:1.3, y:1.3}, (600), Phaser.Easing.Cubic.Out, true).yoyo(true).loop(true)
         game.add.tween(countText3.scale).to({x:1.3, y:1.3}, (600), Phaser.Easing.Cubic.Out, true).yoyo(true).loop(true)
         game.add.tween(countText4.scale).to({x:1.3, y:1.3}, (600), Phaser.Easing.Cubic.Out, true).yoyo(true).loop(true)
        
        
        //Aqui se pone el autobus y todos los animales
        
            bus=game.add.image(-400,20,"atlas.route","UBRE")
            bus.scale.setTo(.7)
            bus.alpha=0
            busSpine=game.add.spine(-100,-100, "Car");
            busSpine.scale.setTo(.7,.7)
            busSpine.setSkinByName("normal");
            busSpine.setAnimationByName(0,"RUN",true)  
            busGroup.add(bus)
            busGroup.add(busSpine)
        
        
            
    }
	

    function onClick(obj){
        
        
        if(proxyTiles[obj.tag].tag=="STRAIGHT" && (proxyTiles[obj.tag].name=="primero" && houseGroup1.alpha==1 || proxyTiles[obj.tag].name=="tercero" && houseGroup3.alpha==1)){
            proxyTiles[obj.tag].tag="LEFT"
            sound.play("clic")
        }else if(proxyTiles[obj.tag].tag=="LEFT" && (proxyTiles[obj.tag].name=="primero" || proxyTiles[obj.tag].name=="tercero")){
            proxyTiles[obj.tag].tag="STRAIGHT"
            sound.play("clic")
        }
        
        if(proxyTiles[obj.tag].tag=="STRAIGHT" && (proxyTiles[obj.tag].name=="segundo" && houseGroup2.alpha==1|| proxyTiles[obj.tag].name=="cuarto" && houseGroup4.alpha==1)){
            proxyTiles[obj.tag].tag="RIGHT"
            sound.play("clic")
        }else if(proxyTiles[obj.tag].tag=="RIGHT" && (proxyTiles[obj.tag].name=="segundo" || proxyTiles[obj.tag].name=="cuarto")){
            proxyTiles[obj.tag].tag="STRAIGHT"
            sound.play("clic")
        }
        
        for(var changeTiles=0;changeTiles<4;changeTiles++){
            
            if(proxyTiles[obj.tag].tag=="STRAIGHT"){
                obj.loadTexture("atlas.route","STRAIGHT")
            }
            if(proxyTiles[obj.tag].tag=="RIGHT"){
                obj.loadTexture("atlas.route","RIGHT")
            }
            if(proxyTiles[obj.tag].tag=="LEFT"){
                obj.loadTexture("atlas.route","LEFT")
            }
        }
    }
  
    
	function update(){
        
        if(tutorialComplete){
        animals[22].scale.setTo(.4,.1)
        //Aqui vamos a hacer los seguidores
            busSpine.position.x=bus.x+100
            busSpine.position.y=bus.y+80
        //Seteo el texto
        houseGroup1.text.setText(scores[0]+"/"+scoreHouse[0])
        houseGroup2.text.setText(scores[1]+"/"+scoreHouse[1])
        houseGroup3.text.setText(scores[2]+"/"+scoreHouse[2])
        houseGroup4.text.setText(scores[3]+"/"+scoreHouse[3])
        
        
            for(var animalFollower=0; animalFollower<animals.length;animalFollower++){
                
                if(animalFollower!=22){
                animalsSpine[animalFollower].position.x=animals[animalFollower].x+40
                animalsSpine[animalFollower].position.y=animals[animalFollower].y+75
            }else if(animalFollower==22){
                animalsSpine[animalFollower].position.x=animals[animalFollower].x+40
                animalsSpine[animalFollower].position.y=animals[animalFollower].centerY+50
            }
                
            }
        
        
        if(gameStarted){
        
        for(var wichIsActive=0; wichIsActive<animalsActive.length;wichIsActive++){
            if(animalsActive[wichIsActive]==false && wichIsActive!=22){
                animals[wichIsActive].position.x=busGroup.x-320
                animals[wichIsActive].position.y=busGroup.y
            }else if(animalsActive[22]==false && wichIsActive==22){
                animals[wichIsActive].position.x=busGroup.x-320
                animals[wichIsActive].position.y=busGroup.y-70
            }
        }
    
        if(timerBus<=timeDificulty && gameStarted==true && (farmLeft>0 || zooLeft>0)){
            timerBus+=1;
        }
        if(timerBus==timeDificulty && howManyAnimals<goal){
            busStart()
        }
            
        if(howManyAnimals==goal){
            sound.play("cheers")
            reset()
        }
            
        //Aqui checamos si salio de pantalla
            
       for(var moveAnimalsOut=0;moveAnimalsOut<animals.length;moveAnimalsOut++){
            if(animalsActive[moveAnimalsOut]==true && animals[moveAnimalsOut].y>game.world.height && gameStarted==true){
                
                //Aqui iran las particulas
                wrongNumber=moveAnimalsOut
                if(moveAnimalsOut<12){
                    farmLeft++
                }else{
                    zooLeft++
                }
                
                animalsActive[moveAnimalsOut]=false
                
                gameStarted=false
                animalsSpine[moveAnimalsOut].alpha=0
                game.time.events.add(1500, function(){
                missPoint()
                //timerBus=0
                gameStarted=true
                })
            }
        } 
            
        //Aqui se mueven los animalitoss
        for(var moveAnimals=0;moveAnimals<animals.length;moveAnimals++){
            if(animalsActive[moveAnimals]==true && animals[moveAnimals].x>-10 && gameStarted==true){
                
                if(animals[moveAnimals].tag=="STRAIGHT"){
                    animals[moveAnimals].position.y+=1
                }
                if(animals[moveAnimals].tag=="LEFT"){
                    animals[moveAnimals].position.x-=1
                }
                if(animals[moveAnimals].tag=="RIGHT"){
                    animals[moveAnimals].position.x+=1
                }   
            }
        }
        
        
        //Check Overlaps
        for(var checkCol=0;checkCol<animals.length;checkCol++){
            for(var checkCol2=0;checkCol2<4;checkCol2++){
                    if (checkOverlap(animals[checkCol], proxyTiles[checkCol2])){
                        animals[checkCol].tag=proxyTiles[checkCol2].tag
                        }
                }
	       }
            
        //Check Overlaps houses
        for(var checkCol3=0;checkCol3<animals.length;checkCol3++){
            for(var checkCol4=0;checkCol4<4;checkCol4++){
                    if (checkOverlap(animals[checkCol3], houses[checkCol4]) && houses[checkCol4].tag==animals[checkCol3].name && animalsActive[checkCol3]==true && (scores[checkCol4]<scoreHouse[checkCol4])){
                        //animalsActive[checkCol3]=false
                        animals[checkCol3].x=-100
                        scores[checkCol4]++
                        if(correctNumber==-1){
                            correctNumber=checkCol4
                            game.add.tween(coins[correctNumber]).to({alpha:1}, 100, Phaser.Easing.Cubic.In, true,100)
                            game.add.tween(coins[correctNumber]).to({x:houses[correctNumber].centerX,y:houses[correctNumber].centerY-100},900,Phaser.Easing.inOut,true).onComplete.add(function(){
                            game.add.tween(coins[correctNumber]).to({x:pointsBar.centerX,y:pointsBar.centerY},200,Phaser.Easing.inOut,true)
                            game.add.tween(coins[correctNumber]).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
                                coins[correctNumber].x=houses[correctNumber].centerX
                                coins[correctNumber].y=houses[correctNumber].centerY
                                addPoint(1)
                                correctNumber=-1
                                })
                            })
                        }else if(correctNumber!=-1 && correctNumber2==-1){
                            correctNumber2=checkCol4
                            game.add.tween(coins[correctNumber2]).to({alpha:1}, 100, Phaser.Easing.Cubic.In, true,100)
                            game.add.tween(coins[correctNumber2]).to({x:houses[correctNumber2].centerX,y:houses[correctNumber2].centerY-100},900,Phaser.Easing.inOut,true).onComplete.add(function(){
                            game.add.tween(coins[correctNumber2]).to({x:pointsBar.centerX,y:pointsBar.centerY},200,Phaser.Easing.inOut,true)
                            game.add.tween(coins[correctNumber2]).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
                                coins[correctNumber2].x=houses[correctNumber2].centerX
                                coins[correctNumber2].y=houses[correctNumber2].centerY
                                addPoint(1)
                                correctNumber2=-1
                                })
                            })
                        }else if(correctNumber2!=-1 && correctNumber3==-1){
                            correctNumber3=checkCol4
                            game.add.tween(coins[correctNumber3]).to({alpha:1}, 100, Phaser.Easing.Cubic.In, true,100)
                            game.add.tween(coins[correctNumber3]).to({x:houses[correctNumber2].centerX,y:houses[correctNumber3].centerY-100},900,Phaser.Easing.inOut,true).onComplete.add(function(){
                            game.add.tween(coins[correctNumber3]).to({x:pointsBar.centerX,y:pointsBar.centerY},200,Phaser.Easing.inOut,true)
                            game.add.tween(coins[correctNumber3]).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
                                coins[correctNumber3].x=houses[correctNumber3].centerX
                                coins[correctNumber3].y=houses[correctNumber3].centerY
                                addPoint(1)
                                correctNumber3=-1
                                })
                            })
                            
                        }else if(correctNumber3!=-1 && correctNumber4==-1){
                            correctNumber4=checkCol4
                            game.add.tween(coins[correctNumber4]).to({alpha:1}, 100, Phaser.Easing.Cubic.In, true,100)
                            game.add.tween(coins[correctNumber4]).to({x:houses[correctNumber4].centerX,y:houses[correctNumber4].centerY-100},900,Phaser.Easing.inOut,true).onComplete.add(function(){
                            game.add.tween(coins[correctNumber4]).to({x:pointsBar.centerX,y:pointsBar.centerY},200,Phaser.Easing.inOut,true)
                            game.add.tween(coins[correctNumber4]).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
                                coins[correctNumber4].x=houses[correctNumber4].centerX
                                coins[correctNumber4].y=houses[correctNumber4].centerY
                                addPoint(1)
                                correctNumber4=-1
                                })
                            })
                            
                        }
                        
                        //animals[checkCol3].alpha=0
                        correctParticle.x=houses[checkCol4].x
                        correctParticle.y=houses[checkCol4].y
                        correctParticle.start(true, 1000, null, 5)
                       
                            
                            
                            
                            
                            
                            
                    
                        howManyAnimals++
                    }else if(checkOverlap(animals[checkCol3], houses[checkCol4]) && (houses[checkCol4].tag!=animals[checkCol3].name && animalsActive[checkCol3]==true || scores[checkCol4]==scoreHouse[checkCol4])){
                        //animalsActive[checkCol3]=false
                        animals[checkCol3].x=-100
                        wrongAnimal=animalsSpine[checkCol3]
                        animalsSpine[checkCol3].setAnimationByName(0,"IDLE",true)
                        wrongNumber=checkCol3
                        wrongNumber2=checkCol4
                        if(checkCol3<12){
                                farmLeft++
                        }else{
                                zooLeft++
                        }
                        animalsActive[wrongNumber]=false
                        animals[wrongNumber].position.x=-100
                        animals[wrongNumber].position.y=-100
                        //wrongAnimal.position.x=animals[checkCol3].x
                        //wrongAnimal.position.y=animals[checkCol3].y
                        //animals[checkCol3].alpha=0
                        game.add.tween(wrongAnimal).to({alpha:0},300, Phaser.Easing.Cubic.Out,true)
                        houseSpine[checkCol4].setAnimationByName(0,"FIGTH",false) 
                        gameStarted=false
                        game.time.events.add(1500, function(){
                            missPoint()
                            if(houses[wrongNumber2].tag=="FARM"){
                                houseSpine[wrongNumber2].setAnimationByName(0,"IDLE_FARM",true)
                            }else{
                                houseSpine[wrongNumber2].setAnimationByName(0,"IDLE_ZOO",true)
                            }
                            gameStarted=true
                            wrongAnimal.alpha=0
                            wrongNumber2=0
                        })
                    }
                }
	           }
            }   
        }
        
    }
    
    function busStart(){
        
    //Sistema Camion
            busGroup.alpha=1
            if(howManyAnimals!=goal && (zooLeft>0 || farmLeft>0)){
            sound.play("bus")
            busTween=game.add.tween(busGroup).to({x:game.world.centerX+300},busSpeed,Phaser.Easing.linear,true).onComplete.add(function(){
               busSpine.setAnimationByName(0,"IDLE",false)
                if(wrongNumber ==-1 && gameStarted){
                        randomHouse=game.rnd.integerInRange(0,1)

                        if(randomHouse==0 && farmLeft>0){
                            randomAnimal=game.rnd.integerInRange(0,11)
                        }else if(randomHouse==1 && zooLeft>0){
                            randomAnimal=game.rnd.integerInRange(12,23)
                        }
                    
                    
                    while(animalsActive[randomAnimal]==true){
                        if(farmLeft>0){
                            randomHouse=0
                        }else if(zooLeft>0){
                            randomHouse=1
                        }
                        if(randomHouse==0){
                            randomAnimal=game.rnd.integerInRange(0,11)
                        }else if(randomHouse==1){
                            randomAnimal=game.rnd.integerInRange(12,23)
                        }
                    }
                    
                    if(randomHouse==0){
                        farmLeft--
                    }else{
                        zooLeft--
                    }
                    
                    animalsActive[randomAnimal]=true
                    animals[randomAnimal].tag="STRAIGHT";
                    animalsSpine[randomAnimal].setAnimationByName(0,"WALK",true)
                    game.add.tween(animalsSpine[randomAnimal]).to({alpha:1},busSpeed-1550, Phaser.Easing.Cubic.In,true)
                    
                }else if(wrongNumber !=-1 && gameStarted==true){
                    randomAnimal=wrongNumber
                    wrongNumber=-1
                    if(randomAnimal<12){
                        farmLeft--
                    }else{
                        zooLeft--
                    }
                    animalsActive[randomAnimal]=true
                    animals[randomAnimal].tag="STRAIGHT";
                    animalsSpine[randomAnimal].setAnimationByName(0,"WALK",true)
                    game.add.tween(animalsSpine[randomAnimal]).to({alpha:1},busSpeed-1550, Phaser.Easing.Cubic.In,true)
                    
                }
                
                    })
                }
            //Aqui va un delayer
            game.time.events.add(600+busSpeed, function(){
                busSpine.setAnimationByName(0,"RUN",true) 
                sound.play("bus")
               busTween=game.add.tween(busGroup).to({x:game.world.width+570},busSpeed,Phaser.Easing.linear,true).onComplete.add(function(){
                        this.stop()
                        busGroup.position.x=0
                        timerBus=0

                })
            })
        
    }
    
    function houseScore(){
        
        for(var scorePosition=0; scorePosition<houses.length;scorePosition++){
            
            if(houses[scorePosition].tag=="FARM"){
                if(dificulty==2)scoreHouse[scorePosition]=farmLeft
                if(dificulty>=3)scoreHouse[scorePosition]=farmLeft/2
                scores[scorePosition]=0
            }
            if(houses[scorePosition].tag=="ZOO"){
                if(dificulty==2 || dificulty==3)scoreHouse[scorePosition]=zooLeft
                if(dificulty>=4)scoreHouse[scorePosition]=zooLeft/2
                scores[scorePosition]=0
            }
            
        }
        
        
    }
    
    function changeHouse(){
        
        var changingHouse=0
        var farmSelected,zooSelected
        var changeNumber=0
        var limit=0
        
        game.add.tween(houseGroup1).to({alpha:0},400, Phaser.Easing.Cubic.Out,true)
        game.add.tween(houseGroup2).to({alpha:0},400, Phaser.Easing.Cubic.Out,true)
        game.add.tween(houseGroup3).to({alpha:0},400, Phaser.Easing.Cubic.Out,true)
        game.add.tween(houseGroup4).to({alpha:0},400, Phaser.Easing.Cubic.Out,true)
        
        game.time.events.add(2000, function(){
            game.add.tween(houseGroup1).to({alpha:1},500, Phaser.Easing.Cubic.In,true)
            game.add.tween(houseGroup2).to({alpha:1},500, Phaser.Easing.Cubic.In,true)
            if(dificulty>=3)game.add.tween(houseGroup3).to({alpha:1},500, Phaser.Easing.Cubic.In,true)
            if(dificulty>=4)game.add.tween(houseGroup4).to({alpha:1},500, Phaser.Easing.Cubic.In,true)
        })
        
        
        if(dificulty==2){
        limit=2
        farmSelected=1
        zooSelected=1
        }
        if(dificulty==3){
        limit=3
        farmSelected=2
        zooSelected=1
        }
        if(dificulty==4){
        limit=4
        farmSelected=2
        zooSelected=2
        }
        while(changingHouse<limit){
            
            changeNumber=game.rnd.integerInRange(0,1)
            if(changeNumber==0 && farmSelected>0){
                houses[changingHouse].tag="FARM"
                houses[changingHouse].loadTexture("atlas.route","FARM")
                houseSpine[changingHouse].setAnimationByName(0,"IDLE_FARM",true) 
                changingHouse++
                farmSelected--
            }else if(changeNumber==1 && zooSelected>0){
                houses[changingHouse].tag="ZOO"
                houses[changingHouse].loadTexture("atlas.route","ZOO")
                houseSpine[changingHouse].setAnimationByName(0,"IDLE_ZOO",true) 
                changingHouse++
                zooSelected--
            }
            
            
        }
        
    }
    
    function reset(){
        
        
        gameStarted=false
        if(busSpeed>900){
            busSpeed-=100
        }
        if(timeDificulty>50){
            timeDificulty-=50
        }
        if(goal>=8 && dificulty<4){
            dificulty++
        }
        if(goal<8){
            goal+=2
        }else if(goal<24){
            goal+=4
        }
        
            changeHouse()

            
            //Aqui averiguamos cuantas casas estan activas y las mostramos
        
        
            //Limpiando animales y pasando al siguiente nivel
            for(var createdAnimals=0;createdAnimals<animals.length;createdAnimals++){
                if(animalsActive[createdAnimals]==true){
                   animalsActive[createdAnimals]=false
                   animals[createdAnimals].position.x=-100
                }
                animalsSpine[createdAnimals].alpha=0
            }
         game.time.events.add(2000, function(){
             howManyAnimals=0
             farmLeft=goal/2
             zooLeft=goal/2
             
             houseScore()
             gameStarted=true
             timerBus=0
         })
    }
    
    function checkOverlap(animal,switcher){
        var boundsA = animal.getBounds();
        var boundsB = switcher.getBounds();
        return Phaser.Rectangle.intersects(boundsA, boundsB); 
    }
    
    function checkOverlap2(animal,house){
        var boundsA = animal.getBounds();
        var boundsB = house.getBounds();
        return Phaser.Rectangle.intersects(boundsA, boundsB); 
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
        particle.makeParticles('atlas.route',key);
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

				particle.makeParticles('atlas.route',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.route','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.route','smoke');
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
    
    function tutorial(){
        
        tutorialComplete=false        
        var animalNamestuto="chiken"
        var animalNamestuto2="lion"
        playButton=game.add.image(game.world.centerX+10,game.world.centerY+170,"atlas.route","button")
        playButton.anchor.setTo(.5)
        play=game.add.image(playButton.centerX-40,playButton.centerY-20,"atlas.route","playEN")
        playButton.alpha=0
        play.alpha=0
        
        manita=game.add.sprite(game.world.width+50,-50, "manita")
        manita.anchor.setTo(.5)
        manita.scale.setTo(.7)
        
        
        
        playButton.inputEnabled=true
        playButton.events.onInputDown.add(onClickTuto,this)
        playButton.tag="continue"
        
        var road
        var placedEspecial=0
        
	   backgroundGroup_t = game.add.group()
       roadGroup_t = game.add.group()
       busGroup_t = game.add.group()
       houseGroup1_t = game.add.group()
       houseGroup2_t = game.add.group()
       houseGroup3_t = game.add.group()
       houseGroup4_t = game.add.group()
       animalsGroup_t = game.add.group()
       bubble1Group_t=game.add.group()
       bubble2Group_t=game.add.group()
       bubble3Group_t=game.add.group()
       bubble4Group_t=game.add.group()
       tutorialprob_t=game.add.group()
       tutoGroup.add(backgroundGroup_t)
       tutoGroup.add(roadGroup_t)
       tutoGroup.add(busGroup_t)
       tutoGroup.add(houseGroup1_t)
       tutoGroup.add(houseGroup2_t)
       tutoGroup.add(houseGroup3_t)
       tutoGroup.add(houseGroup4_t)
       tutoGroup.add(tutorialprob_t)
       tutoGroup.add(animalsGroup_t)
       tutoGroup.add(bubble1Group_t)
       tutoGroup.add(bubble2Group_t)
       tutoGroup.add(bubble3Group_t)
       tutoGroup.add(bubble4Group_t)
        
        
        //Rapida inicializaciòn
        
        
        
        correctParticlet = createPart("star")
        tutoGroup.add(correctParticlet)
        
        
        animalsNamestuto="chiken"
        animalsNamestuto2="lion"
        
        
        
        //Meto las animaciones de los animales a un arreglo
        
            animalsSpineTuto=game.add.spine(200,200, "Animals");
            animalsSpineTuto.scale.setTo(.6,.6)
            animalsSpineTuto.alpha=0
            animalsSpineTuto.setSkinByName(animalsNamestuto);
            animalsSpineTuto.setAnimationByName(0,"WALK",true)
            animalsGroup_t.add(animalsSpineTuto)
        
            animalsSpineTuto2=game.add.spine(200,200, "Animals");
            animalsSpineTuto2.scale.setTo(.4,.4)
            animalsSpineTuto2.alpha=0
            animalsSpineTuto2.setSkinByName(animalsNamestuto2);
            animalsSpineTuto2.setAnimationByName(0,"WALK",true)
            animalsGroup_t.add(animalsSpineTuto2)
        
        
        backG=game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.route','BG')
        backgroundGroup_t.add(backG)
        
        for(var placeRoad=0;placeRoad<game.world.width/100;placeRoad++){
            road=game.add.image(placeRoad*100,0,"atlas.route","HORIZONTAL")
            roadGroup_t.add(road)
        }
        
         for(var placeRoad=1;placeRoad<game.world.height/100;placeRoad++){
            if(placeRoad==2 || placeRoad==4){
                proxyTiles[placedEspecial]=game.add.sprite(game.world.centerX+10,placeRoad*100+50,"atlas.route","STRAIGHT")
                goldTiles[placedEspecial]=game.add.sprite(game.world.centerX+10,placeRoad*100+50,"atlas.route","STRAIGHT")
                proxyTiles[placedEspecial].anchor.setTo(0.5,0.5)
                proxyTiles[placedEspecial].scale.setTo(0.1,0.1)
                goldTiles[placedEspecial].scale.setTo(1,0.9)
                proxyTiles[placedEspecial].tag="STRAIGHT"
                goldTiles[placedEspecial].tag=(placeRoad/2)-1
                    if(placeRoad==2){
                        proxyTiles[placedEspecial].name="primero"
                    }
                    if(placeRoad==4){
                       proxyTiles[placedEspecial].name="segundo"
                    }
                  goldTiles[placedEspecial].inputEnabled=true
                  goldTiles[placedEspecial].events.onInputDown.add(onClickTuto,this)
                for(var placeRoad2=0;placeRoad2<2;placeRoad2++){
                    
                    if(placeRoad==2){
                        road=game.add.image(game.world.centerX-118+placeRoad2*-50,placeRoad*100,"atlas.route","HORIZONTAL")
                        road.scale.setTo(0.5,0.85)
                        houseGroup1_t.add(road)
                    }
                    if(placeRoad==4){
                        road=game.add.image(game.world.centerX+68+placeRoad2*50,placeRoad*100,"atlas.route","HORIZONTAL")
                        road.scale.setTo(0.5,0.85)
                        houseGroup2_t.add(road)
                    }
                }
                
            //proxyTiles[placedEspecial].add(mouse.down)
            roadGroup_t.add(proxyTiles[placedEspecial])
            
            placedEspecial++
            }else{
             road=game.add.image(game.world.centerX-50,placeRoad*100,"atlas.route","VERTICAL")
             road.scale.setTo(1,0.9)
             roadGroup_t.add(road)
            }
             
           
        }
        //Aqui voy a meter las casas 
            tutorialprob_t.add(goldTiles[0])
            tutorialprob_t.add(goldTiles[1])
        
            houses[0]=game.add.image(game.world.centerX-270,proxyTiles[0].y-90,"atlas.route","FARM")
            houses[0].scale.setTo(.6)
            houses[0].tag="FARM"
            houseSpine[0]=game.add.spine(houses[0].centerX,houses[0].centerY+100, "House");
            houseSpine[0].scale.setTo(.7,.7)
            houseSpine[0].setSkinByName("normal");
            houseSpine[0].setAnimationByName(0,"IDLE_FARM",true) 
            houses[1]=game.add.image(game.world.centerX+170,proxyTiles[1].y-90,"atlas.route","ZOO")
            houses[1].scale.setTo(.6)
            houses[1].tag="ZOO"
            houseSpine[1]=game.add.spine(houses[1].centerX,houses[1].centerY+100, "House");
            houseSpine[1].scale.setTo(.7,.7)
            houseSpine[1].setSkinByName("normal");
            houseSpine[1].setAnimationByName(0,"IDLE_ZOO",true) 
            houses[0].alpha=0
            houses[1].alpha=0
            houseGroup1_t.add(houses[0])
            houseGroup2_t.add(houses[1])
            houseGroup1_t.add(houseSpine[0])
            houseGroup2_t.add(houseSpine[1])
        
        
        //Aqui se pone el autobus y todos los animales
        
            bus=game.add.image(-400,20,"atlas.route","UBRE")
            bus.scale.setTo(.7)
            bus.alpha=0
            busSpine=game.add.spine(-100,100, "Car");
            busSpine.scale.setTo(.7,.7)
            busSpine.setSkinByName("normal");
            busSpine.setAnimationByName(0,"RUN",true)  
            busGroup_t.add(bus)
            busGroup_t.add(busSpine)
        
        //Aqui va a ir el tutorial, ire enumerando los pasaso que voy siguiendo para la resolución de este
        
        
        
        
        //Uno: Crear cuatro rectangulos que pongan todo el fondo del juego oscuro
        
        rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2,120)
        rect.alpha = 0.5
        rect.endFill()
        
        rect2 = new Phaser.Graphics(game)
        rect2.beginFill(0x000000)
        rect2.drawRect(0,120,game.world.width *2,230)
        rect2.alpha = 0.6
        rect2.endFill()
        
        rect3 = new Phaser.Graphics(game)
        rect3.beginFill(0x000000)
        rect3.drawRect(0,350,game.world.width *2,230)
        rect3.alpha = 0.7
        rect3.endFill()
        
        rect4 = new Phaser.Graphics(game)
        rect4.beginFill(0x000000)
        rect4.drawRect(0,580,game.world.width *2,game.world.height)
        rect4.alpha = 0.7
        rect4.endFill()
        
        manita.x=proxyTiles[0].x+30
        manita.y=proxyTiles[0].y
        manita.alpha=0
        goldTiles[0].anchor.setTo(.5)
        goldTiles[1].anchor.setTo(.5)
        game.add.tween(goldTiles[0].scale).to({x:1.1, y:1.1}, (600), Phaser.Easing.Cubic.Out, true).yoyo(true).loop(true)
        game.add.tween(goldTiles[1].scale).to({x:1.1, y:1.1}, (600), Phaser.Easing.Cubic.Out, true).yoyo(true).loop(true)
        //Dos: Animar el coche a una posición donde se vea y quitar el rectangulo de hasta arriba
        
        game.add.tween(rect).to({alpha:0}, 900, Phaser.Easing.Cubic.In, true,100).onComplete.add(function(){
            game.add.tween(busGroup_t).to({x:game.world.centerX+110},1200,Phaser.Easing.linear,true).onComplete.add(function(){
                animalsSpineTuto.x=busGroup_t.x-100
                animalsSpineTuto.y=busGroup_t.y+100
                game.add.tween(animalsSpineTuto).to({alpha:1}, 900, Phaser.Easing.Cubic.In, true,100).onComplete.add(function(){
                    game.add.tween(rect2).to({alpha:0}, 1100, Phaser.Easing.Cubic.In, true,100).onComplete.add(function(){
                        game.add.tween(manita).to({alpha:1}, 1400, Phaser.Easing.Cubic.In, true,100).onComplete.add(function(){
                        manita.animations.add('idle');
                        manita.animations.play('idle', 24, true);                   
                        count=1
                        })
                    })
                })
            })
        })
        
        
        //Tres: Mover el coche a la mitad del camino y crear un animalito, quitamos el segundo rectangulo
        
        
        
        //Cuatro: Movemos la manita hacia el cuadro de cambio y mantenemos un loop hasta que le den clic a este
        
        
        //Cinco: Movemos al animalito a la posición y luego cuando empice a moverse hacia la casa traemos el nuevo coche con el otro animalito
        
        
        //Seis: Metemos al primer animalito a su casa y le mostramos la manita con el pulgar arriba, luego que el segundo animalito comience a bajar
        
        
        //Siete: Antes de continuar con el movimiento le decimos al jugador con la manita que le de clic al primer cuadro de cambio
        
        
        
        //Ocho: Cuando llegue a este cuadro descubrimos el ultimo cuadro y le decimos que tambien le de clic al otro cuadro
        
        
        //Nueve: Movemos el animalito hacia el siguiente cuadro y de ahi que se mueva hacia su casa, cuando llegue le damos el correcto con la manita esperamos tantito y volamos el tutoGroup e inmediatamente mostramos el SceneGroup
        
        
        tutoGroup.add(rect)
        tutoGroup.add(rect2)
        tutoGroup.add(rect3)
        tutoGroup.add(rect4)
        tutoGroup.add(playButton)
        tutoGroup.add(play)
    }
    
    function onClickTuto(obj){
        if(!tutorialComplete){
        if(count==1 && proxyTiles[obj.tag].tag=="STRAIGHT" && proxyTiles[obj.tag].name=="primero"){
            sound.play("clic")
            correctParticlet.x=proxyTiles[obj.tag].x+350
            correctParticlet.y=proxyTiles[obj.tag].y+230
            correctParticlet.scale.setTo(.5)
            correctParticlet.start(true, 1000, null, 10)
            goldTiles[0].loadTexture("atlas.route","LEFT")
            proxyTiles[obj.tag].tag="LEFT"
            manita.alpha=0
            count=0
            game.add.tween(busGroup_t).to({x:game.world.width+310},1200,Phaser.Easing.linear,true)
            game.add.tween(animalsSpineTuto).to({x:goldTiles[0].centerX,y:goldTiles[0].centerY},1200,Phaser.Easing.linear,true).onComplete.add(function(){
                busGroup_t.x=-100
                game.add.tween(busGroup_t).to({x:game.world.centerX+110},1200,Phaser.Easing.linear,true)
                animalsSpineTuto2.x=game.world.centerX
                animalsSpineTuto2.y=busGroup_t.y+100
                game.add.tween(animalsSpineTuto).to({x:houses[0].x+150,y:houses[0].centerY},1200,Phaser.Easing.linear,true).onComplete.add(function(){
                        game.add.tween(animalsSpineTuto2).to({alpha:1}, 900, Phaser.Easing.Cubic.In, true,100).onComplete.add(function(){
                            game.add.tween(manita).to({alpha:1}, 900, Phaser.Easing.Cubic.In, true,100).onComplete.add(function(){
                                count=2
                            })
                        })
                    })
                })
        }
        if(count==2 && proxyTiles[obj.tag].tag=="LEFT"){
            
            sound.play("clic")
            goldTiles[0].loadTexture("atlas.route","STRAIGHT")
            proxyTiles[obj.tag].tag="STRAIGHT1"
            manita.alpha=0
            count=0
            correctParticlet.x=proxyTiles[obj.tag].x+350
            correctParticlet.y=proxyTiles[obj.tag].y+230
            correctParticlet.scale.setTo(.5)
            correctParticlet.start(true, 1000, null, 10)
            game.add.tween(animalsSpineTuto2).to({x:goldTiles[0].centerX,y:goldTiles[0].centerY},1200,Phaser.Easing.linear,true).onComplete.add(function(){
                manita.x=proxyTiles[1].x+30
                manita.y=proxyTiles[1].y
                manita.alpha=0
                manita.animations.stop("idle",0)
                game.add.tween(animalsSpineTuto).to({x:houses[0].centerX,y:houses[0].centerY},1200,Phaser.Easing.linear,true).onComplete.add(function(){
                    animalsSpineTuto.alpha=0
                    correctParticlet.scale.setTo(1)
                    correctParticlet.x=houses[0].x
                    correctParticlet.y=houses[0].y
                    correctParticlet.start(true, 1000, null, 5)    
                      game.add.tween(rect3).to({alpha:0}, 1100, Phaser.Easing.Cubic.In, true,100).onComplete.add(function(){
                        game.add.tween(manita).to({alpha:1}, 900, Phaser.Easing.Cubic.In, true,100).onComplete.add(function(){
                            manita.animations.play('idle', 24, true);
                            count=3
                            game.add.tween(busGroup_t).to({x:game.world.width+310},1200,Phaser.Easing.linear,true)
                         })
                    })
                })
            })
        }
        if(count==4 && obj.tag=="continue"){
                sound.play("pop")
                tutoGroup.alpha=0
                playButton.inputEnabled=false
                createBackground()
                initialize()
                gameStarted=true
                tutorialComplete=true
                houseScore()
                startGame=true
                animateScene()
                createPointsBar()
			    createHearts()
                buttons.getButton(spaceSong,sceneGroup)
        }
        if(count==3 && proxyTiles[obj.tag].tag=="STRAIGHT"){
            sound.play("clic")
            goldTiles[1].loadTexture("atlas.route","RIGHT")
            proxyTiles[obj.tag].tag="STRAIGHT1"
            manita.alpha=0
                correctParticlet.x=proxyTiles[1].x+350
                correctParticlet.y=proxyTiles[1].y+400
                correctParticlet.scale.setTo(.5)
                correctParticlet.start(true, 1000, null, 10)
                game.add.tween(animalsSpineTuto2).to({x:goldTiles[1].centerX,y:goldTiles[1].centerY},1200,Phaser.Easing.linear,true).onComplete.add(function(){
                    game.add.tween(animalsSpineTuto2).to({x:houses[1].centerX,y:houses[1].centerY},1200,Phaser.Easing.linear,true).onComplete.add(function(){
                        correctParticlet.scale.setTo(1)
                        correctParticlet.x=houses[1].x
                        correctParticlet.y=houses[1].y
                        correctParticlet.start(true, 1000, null, 5)
                        game.add.tween(animalsSpineTuto2).to({alpha:1}, 1200, Phaser.Easing.Cubic.In, true,100).onComplete.add(function(){
                        count=4
                        game.add.tween(animalsSpineTuto2).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
                        game.add.tween(playButton).to({alpha:1}, 300, Phaser.Easing.Cubic.In, true,100)
                        game.add.tween(play).to({alpha:1}, 300, Phaser.Easing.Cubic.In, true,100)
                        playButton.inputEnabled=true
                        goldTiles[0].inputEnabled=false
                        goldTiles[1].inputEnabled=false
                        })
                    })
                })
            
        }
            
        }
    }
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
	}
	
	return {
		
		assets: assets,
		name: "animalRoute",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
            tutoGroup = game.add.group()
			
			//createBackground()
			
                        			
            spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
			
            addParticles()
            if(!tutorialComplete){
                tutorial()
                animateScene()
                initialize()
            }else{
                 createBackground()
                 
                 gameStarted=true
                 houseScore()
                 startGame=true
                 createPointsBar()
			     createHearts()
                 buttons.getButton(spaceSong,sceneGroup)
            }
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()