
var soundsPath = "../../shared/minigames/sounds/"
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
            {	name: "vacc",
				file: soundsPath + "swipe.mp3"},
             {	name: "bus",
				//file: soundsPath + "bus.mp3"
             },
            
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
    var gameStarted=false
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 102
	var indexGame
    var overlayGroup
    var spaceSong
    
    var backgroundGroup=null
    var gameGroup=null
    var roadGroup=null
    var busGroup=null
    var animalsGroup=null
    var houseGroup=null
    

    var animals=new Array(24)
    var animalsActive=new Array(24)
    var houses=new Array(4)
    var housesActive=new Array(4)
    var countersHouses=new Array(4)
    var bus
    
    var proxyTiles=new Array(4)
    var goldTiles=new Array(4)
    
    var level=null
    
    var waitingTime=null
    var howManyAnimals=null
    var busSpeed=null
    var animalSpeed=null
    
    var randomAnimal, randomHouse, farmLeft, zooLeft
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#220341"
        lives = 3
        howManyAnimals=0
        level=1
        farmLeft=2
        zooLeft=2
        busSpeed=100
        timerBus=100
        waitingTime=10
        animalSpeed=20
        
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
        animals[23]=game.add.image(0,0,"atlas.route","TIGER")
        animals[24]=game.add.image(0,0,"atlas.route","GORILA")
        
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
        
        game.load.audio('spaceSong', soundsPath + 'songs/electro_trance_minus.mp3');
        
		game.load.image('howTo',"images/game/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/game/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/game/introscreen.png")
        
//        game.load.spine("ship","images/Spine/ship/ship.json")
        
        
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("pop")
            
            //Aqui va la primera funciòn que realizara el juego
            gameStarted=true
            
            startGame=true
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.route','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'Movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.route',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.route','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
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
       animalsGroup = game.add.group()
       houseGroup = game.add.group()
       houseGroup1 = game.add.group()
       houseGroup2 = game.add.group()
       houseGroup3 = game.add.group()
       houseGroup4 = game.add.group()
       sceneGroup.add(backgroundGroup)
       sceneGroup.add(roadGroup)
       sceneGroup.add(busGroup)
       sceneGroup.add(animalsGroup)
       sceneGroup.add(houseGroup)
       sceneGroup.add(houseGroup1)
       sceneGroup.add(houseGroup2)
       sceneGroup.add(houseGroup3)
       sceneGroup.add(houseGroup4)
        
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        
        
        
        
        backG=game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.route','BG')
        backgroundGroup.add(backG)
        
        for(var placeRoad=0;placeRoad<game.world.width/100;placeRoad++){
            road=game.add.image(placeRoad*100,0,"atlas.route","HORIZONTAL")
            roadGroup.add(road)
        }
        
         for(var placeRoad=1;placeRoad<game.world.height/100;placeRoad++){
            if(placeRoad==2 || placeRoad==4 || placeRoad==6 || placeRoad==8){
                proxyTiles[placedEspecial]=game.add.sprite(game.world.centerX+10,placeRoad*100+50,"atlas.route","STRAIGHT")
                goldTiles[placedEspecial]=game.add.sprite(game.world.centerX-50,placeRoad*100,"atlas.route","STRAIGHT")
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
            roadGroup.add(proxyTiles[placedEspecial])
            roadGroup.add(goldTiles[placedEspecial])
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
            houses[1]=game.add.image(game.world.centerX+170,proxyTiles[1].y-90,"atlas.route","ZOO")
            houses[1].scale.setTo(.6)
            houses[1].tag="ZOO"
            houses[2]=game.add.image(game.world.centerX-270,proxyTiles[2].y-90,"atlas.route","FARM")
            houses[2].scale.setTo(.6)
            houses[2].tag="FARM"
            houses[3]=game.add.image(game.world.centerX+170,proxyTiles[3].y-90,"atlas.route","ZOO")
            houses[3].scale.setTo(.6)
            houses[3].tag="ZOO"
                
            houseGroup1.add(houses[0])
            houseGroup2.add(houses[1])
            houseGroup3.add(houses[2])
            houseGroup4.add(houses[3])
        
            houseGroup3.alpha=0
            houseGroup4.alpha=0
            
        //Aqui se pone el autobus y todos los animales
        
            bus=game.add.image(-400,20,"atlas.route","UBRE")
            bus.scale.setTo(.7)
            busGroup.add(bus)
            
            
    }
	

    function onClick(obj){
        
        if(proxyTiles[obj.tag].tag=="STRAIGHT" && (proxyTiles[obj.tag].name=="primero" && houseGroup1.alpha==1 || proxyTiles[obj.tag]=="tercero" && houseGroup3.alpha==1)){
            proxyTiles[obj.tag].tag="LEFT"
        }else if(proxyTiles[obj.tag].tag=="LEFT" && (proxyTiles[obj.tag].name=="primero" || proxyTiles[obj.tag].name=="tercero")){
            proxyTiles[obj.tag].tag="STRAIGHT"
        }
        
        if(proxyTiles[obj.tag].tag=="STRAIGHT" && (proxyTiles[obj.tag].name=="segundo" && houseGroup2.alpha==1|| proxyTiles[obj.tag].name=="cuarto" && houseGroup4.alpha==1)){
            proxyTiles[obj.tag].tag="RIGHT"
        }else if(proxyTiles[obj.tag].tag=="RIGHT" && (proxyTiles[obj.tag].name=="segundo" || proxyTiles[obj.tag].name=="cuarto")){
            proxyTiles[obj.tag].tag="STRAIGHT"
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
    
        if(timerBus<=300){
            timerBus+=1;
        }
        if(timerBus==300 && howManyAnimals<4){
            busStart()
        }
        
        //Aqui se mueven los animalitoss
        for(var moveAnimals=0;moveAnimals<animals.length;moveAnimals++){
            if(animalsActive[moveAnimals]==true && animals[moveAnimals].x>-10){
                
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
                    if (checkOverlap(animals[checkCol3], houses[checkCol4]) && houses[checkCol4].tag==animals[checkCol3].name && animalsActive[checkCol3]==true){
                        //animalsActive[checkCol3]=false
                        animals[checkCol3].x=-100
                        animals[checkCol3].alpha=0
                        addPoint(1)  
                        howManyAnimals++
                        if(randomHouse==0){
                        farmLeft--
                        }else{
                        zooLeft--
                        }
                    }else if(checkOverlap(animals[checkCol3], houses[checkCol4]) && houses[checkCol4].tag!=animals[checkCol3].name && animalsActive[checkCol3]==true){
                        //animalsActive[checkCol3]=false
                        animals[checkCol3].x=-100
                        animals[checkCol3].alpha=0
                        missPoint()
                    }
                }
	       }
            
            
        }
        
    }
    function busStart(){
        
    //Sistema Camion
            busGroup.alpha=1
            game.add.tween(busGroup).to({x:game.world.centerX+300},1950,Phaser.Easing.linear,true).onComplete.add(function(){
                
                        randomHouse=game.rnd.integerInRange(0,1)
                        if(randomHouse==0 && farmLeft>0){
                            randomAnimal=game.rnd.integerInRange(0,11)
                        }else if(randomHouse==1 && zooLeft>0){
                            randomAnimal=game.rnd.integerInRange(12,24)
                        }
                    
                    while(animalsActive[randomAnimal]==true){
                        console.log(randomHouse)
                        randomHouse=game.rnd.integerInRange(0,1)
                        if(randomHouse==0 && farmLeft>0){
                            randomAnimal=game.rnd.integerInRange(0,11)
                        }else if(randomHouse==1 && zooLeft>0){
                            randomAnimal=game.rnd.integerInRange(12,24)
                        }
                    }
                    
                    
                        animalsActive[randomAnimal]=true
                        animals[randomAnimal].tag="STRAIGHT";
                        animals[randomAnimal]
                        game.add.tween(animals[randomAnimal]).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
                
            })
            //Aqui va un delayer
            game.time.events.add(2550, function(){
                game.add.tween(busGroup).to({x:game.world.width+570},1950,Phaser.Easing.linear,true).onComplete.add(function(){
                        this.stop()
                        busGroup.position.x=0
                        timerBus=0
                })
            })
        
    }
    
    function reset(){
            
        dificulty++
        
            
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
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
	}
	
	return {
		
		assets: assets,
		name: "base",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
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
            
            initialize()
			            
			createPointsBar()
			createHearts()
			
			buttons.getButton(spaceSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()