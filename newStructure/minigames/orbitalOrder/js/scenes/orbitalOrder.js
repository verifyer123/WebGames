
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var tutorialPath = "../../shared/minigames/"
var orbitalOrder = function(){
    
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
                name: "atlas.orbital",
                json: "images/orbital/atlas.json",
                image: "images/orbital/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/orbital/timeAtlas.json",
                image: "images/orbital/timeAtlas.png",
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
				file:"images/orbital/tutorial_image_%input.png"
			}

		],
        spines: [
            
            {   
                name: "planets",
                file: "images/Spine/planets/planets.json",
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
            {   name:"acornSong",
				file: soundsPath + 'songs/dance_baby.mp3'}
			
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
    var gameIndex = 147
    var tutoGroup
    var rect2
	var indexGame
    var overlayGroup
    var baseSong
    var planets= new Array(8)
    var planetsProxy= new Array(8)
    var planetsPosition= new Array(9)
    var correctPlaces=new Array(8)
    var speeds= new Array(10)
    var planetNames= new Array(9)
    var planetsGroups = new Array(9)
    var targetsGroup=new Array(9)
    var positions=new Array(8)
    var positionsX=new Array(8)
    var planetToStop
    var dificulty
    var spotlight
    var countExact
    var planetAlready1,planetAlready2,planetAlready3,planetAlready4,planetAlready5,planetAlready6,planetAlready7,planetAlready8
    
    var planets=new Array(8)
    
    var backgroundGroup=null
    
    var tweenTiempo
    var clock, timeBar
    var emitter

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){
          
        game.stage.backgroundColor = "#000000"
        lives = 3
        emitter=""
        dificulty=0.01
        loadSounds()
        countExact=0
        countExact=0
        planetAlready1=0
        planetAlready2=0
        planetAlready3=0
        planetAlready4=0
        planetAlready5=0
        planetAlready6=0
        planetAlready7=0
        planetAlready8=0
        countCorrect=0
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.orbital','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.orbital','life_box')

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
       
        for(var targets=0; targets<targetsGroup.length;targets++){
            targetsGroup[targets]=game.add.group()
            sceneGroup.add(targetsGroup[targets])
        }
        
        for(var place=0; place<planetsGroups.length;place++){
            
            planetsGroups[place]=game.add.group()
            sceneGroup.add(planetsGroups[place])
            planetsGroups[place].position.x=game.world.centerX
            planetsGroups[place].position.y=0
            targetsGroup[place].position.x=game.world.centerX
            targetsGroup[place].position.y=0
        }
        
        spotGroup=game.add.group()
        sceneGroup.add(spotGroup)
        
        
        
        
        
        spotGroup.position.x=game.world.centerX
        spotGroup.position.y=0
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        
        //Ponemos el fondo
        
        backG=game.add.sprite(game.world.centerX,game.world.centerY,"atlas.orbital","Fondo");
        backG.anchor.setTo(0.5,0.5)
        backG.scale.setTo(game.world.width/500,1)
        backgroundGroup.add(backG)
        
        //Aqui pondre el sol
        
        planetNames[0]="sun";
        planetNames[1]="mercury";
        planetNames[2]="venus";
        planetNames[3]="earth";
        planetNames[4]="mars";
        planetNames[5]="jupiter";
        planetNames[6]="saturn";
        planetNames[7]="uranus";
        planetNames[8]="neptune";
        
        
        //Aqui creo spotlight

        spotlight=createCircleSprite(0,0,100);
        spotlight.alpha=0.7
        spotGroup.add(spotlight)
        
        //Aqui dibujo las orbitas
        drawOrbits()
        
        
        //Aqui creo el rect para tap
        
        rect2 = new Phaser.Graphics(game)
        rect2.beginFill(0xffffff)
        rect2.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect2.alpha = 0
        rect2.endFill()
        rect2.inputEnabled=true
        rect2.events.onInputDown.add(stopPlanetsNorm, this);
		sceneGroup.add(rect2)
        
        //Aqui inicializo las velocidades
        //var fill2=10
//        for(var fill=0; fill<10; fill++){
//            //speeds[fill]=0.005*(fill2+1)
//            speeds[fill]=0.02/fill
//            //fill2--
//        }
        dificulty=0.01
        for(var fill=0; fill<10; fill++){
            speeds[fill]=(Math.random()*dificulty+0.01)+dificulty;
            console.log(speeds[fill])
            if(fill<8){
                targetsGroup[fill].rotation=((Math.random()*0.4)-0.1);
            }
        }
        var where=0
        
        for(var fillPlanets=0; fillPlanets<9; fillPlanets++){
            where=game.rnd.integerInRange(0,100)
            planetsPosition[fillPlanets+1]=fillPlanets
            if(fillPlanets==0){
                planets[fillPlanets]=game.add.spine(0,0,"planets");
            }else{
                planets[fillPlanets]=game.add.spine((fillPlanets-1)+where,(fillPlanets-1)*100+150,"planets");
                planetsProxy[fillPlanets]=game.add.sprite(planets[fillPlanets].x, planets[fillPlanets].y,"atlas.orbital","earth")
                planetsProxy[fillPlanets].anchor.setTo(0.5,0.5)
                planetsProxy[fillPlanets].scale.setTo(0.2,0.2)
                positions[fillPlanets]=planets[fillPlanets].y
                
                correctPlaces[fillPlanets]=game.add.sprite( planets[fillPlanets].x, planets[fillPlanets].y,"atlas.orbital","target")
                correctPlaces[fillPlanets].anchor.setTo(0.5,0.5)
                correctPlaces[fillPlanets].scale.setTo(1.5,1.5)
                
                targetsGroup[fillPlanets].add(correctPlaces[fillPlanets])
                
                targetsGroup[fillPlanets].rotation=((Math.random()*0.4)-0.1);
                planetsGroups[fillPlanets].add(planetsProxy[fillPlanets])
            }
            
            planets[fillPlanets].setSkinByName(planetNames[fillPlanets])
            planets[fillPlanets].setAnimationByName(0,"IDLE",true)
            
            planetsGroups[fillPlanets].add(planets[fillPlanets])
            
        }
        
        
        //Aqui coloco el objetivo
        
        normSpot()
        
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        boomParticle = createPart("smoke")
        sceneGroup.add(boomParticle)
        
        
        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
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
             for(var moveGroups=0; moveGroups<planetsGroups.length;moveGroups++){
                planetsGroups[moveGroups].rotation+=speeds[moveGroups];
                 if(planetsGroups[moveGroups].angle>=359)planetsGroups[moveGroups].angle=0
            }
            
            spotGroup.rotation+=speeds[planetToStop];
            spotlight.x=planetsProxy[planetToStop].x;
            spotlight.y=planetsProxy[planetToStop].y;
            
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
        var circle = game.add.graphics(turnToSprite.centerX, turnToSprite.centerY);
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
    
    function reset(){
            
        
        planetAlready1=0
        planetAlready2=0
        planetAlready3=0
        planetAlready4=0
        planetAlready5=0
        planetAlready6=0
        planetAlready7=0
        planetAlready8=0
        
        for(var fill=0; fill<10; fill++){
            speeds[fill]=(Math.random()*dificulty+0.01)+dificulty;
            if(fill<8){
                targetsGroup[fill].rotation=((Math.random()*0.4)-0.1);
            }
        }
        if(pointsBar.number<16){
            planetToStop=1
        }else{
            randSpot()
            rect2.events.onInputDown.remove(stopPlanetsNorm, this);
            rect2.events.onInputDown.add(stopPlanetsRand, this);
        }
        
        spotGroup.rotation=planetsGroups[planetToStop].rotation
        spotlight.x=planets[planetToStop].x;
        spotlight.y=planets[planetToStop].y;
            
    }
    
    function checkOverlap(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);
    }
    
    function stopPlanetsNorm(obj){
        
        var temp=0
        speeds[planetToStop]=0;
        
        if(checkOverlap(planetsProxy[planetToStop],correctPlaces[planetToStop])){
            
            Coin(planets[planetToStop],pointsBar,100);
            
        }else{
            missPoint()
            speeds[planetToStop]=0;
            temp=planetToStop
            rect2.inputEnabled=false
            //planetsGroups[temp].rotation=targetsGroup[temp].rotation-2;
            
            game.add.tween(planetsGroups[temp]).to({angle:targetsGroup[temp].angle},800,Phaser.Easing.Cubic.Linear,true,100).onComplete.add(function(){
                rect2.inputEnabled=true
            })
            
            //Aqui ira otra funcion
        }
        
        countExact++
        
        if(countExact<8){
        
        if(planetAlready1==0){
            planetAlready1=planetToStop;
        }else if(planetAlready2==0){
            planetAlready2=planetToStop;
        }else if(planetAlready3==0){
            planetAlready3=planetToStop;
        }else if(planetAlready4==0){
            planetAlready4=planetToStop;
        }else if(planetAlready5==0){
            planetAlready5=planetToStop;
        }else if(planetAlready6==0){
            planetAlready6=planetToStop;
        }else if(planetAlready7==0){
            planetAlready7=planetToStop;
        }else if(planetAlready8==0){
            planetAlready8=planetToStop;
        }
        
        planetToStop++
        
            spotGroup.rotation=planetsGroups[planetToStop].rotation
            spotlight.x=planets[planetToStop].x;
            spotlight.y=planets[planetToStop].y;
            
        }else{
            game.time.events.add(1000,function(){
                countExact=0
                reset()
            })
        }
    }
    
    function stopPlanetsRand(obj){
        
        speeds[planetToStop]=0;
        
        if(checkOverlap(planetsProxy[planetToStop],correctPlaces[planetToStop])){
            
            Coin(planets[planetToStop],pointsBar,100);
            
        }else{
            missPoint()
            speeds[planetToStop]=0;
            temp=planetToStop
            rect2.inputEnabled=false
            //planetsGroups[temp].rotation=targetsGroup[temp].rotation-2;
            
            game.add.tween(planetsGroups[temp]).to({angle:targetsGroup[temp].angle},800,Phaser.Easing.Cubic.Linear,true,100).onComplete.add(function(){
                rect2.inputEnabled=true
            })
            
            //Aqui ira otra funcion
        }
        
        if(planetAlready1==0){
            planetAlready1=planetToStop;
        }else if(planetAlready2==0){
            planetAlready2=planetToStop;
        }else if(planetAlready3==0){
            planetAlready3=planetToStop;
        }else if(planetAlready4==0){
            planetAlready4=planetToStop;
        }else if(planetAlready5==0){
            planetAlready5=planetToStop;
        }else if(planetAlready6==0){
            planetAlready6=planetToStop;
        }else if(planetAlready7==0){
            planetAlready7=planetToStop;
        }else if(planetAlready8==0){
            planetAlready8=planetToStop;
        }
        
        
        countExact++
        
        if(countExact<8){
            planetToStop=game.rnd.integerInRange(1,8);
            while(planetToStop==planetAlready1 || planetToStop==planetAlready2 || planetToStop==planetAlready3 || planetToStop==planetAlready4 || planetToStop==planetAlready5 || planetToStop==planetAlready6 || planetToStop==planetAlready7 || planetToStop==planetAlready8){
                
                planetToStop=game.rnd.integerInRange(1,8);
                spotGroup.rotation=planetsGroups[planetToStop].rotation
                spotlight.x=planets[planetToStop].x;
                spotlight.y=planets[planetToStop].y;

            }
                spotGroup.rotation=planetsGroups[planetToStop].rotation
                spotlight.x=planets[planetToStop].x;
                spotlight.y=planets[planetToStop].y;
        }else{
            countExact=0
            reset()
        }
    }
    
    function drawOrbits(){
        
        bmd = game.add.bitmapData(game.world.width,game.world.height);
        bmd.ctx.translate(game.world.centerX-65, -50);
        bmd.ctx.beginPath();
        bmd.ctx.setLineDash([30]);
        bmd.ctx.strokeStyle = 'white'; 
        bmd.ctx.arc(65,65,150,0,100 * Math.PI,false);
        bmd.ctx.stroke();
        first1=bmd.addToWorld()
        backgroundGroup.add(first1)
        
        bmd = game.add.bitmapData(game.world.width,game.world.height);
        bmd.ctx.translate(game.world.centerX-65, -50);
        bmd.ctx.beginPath();
        bmd.ctx.setLineDash([30]);
        bmd.ctx.strokeStyle = 'white'; 
        bmd.ctx.arc(65,65,250,0,100 * Math.PI,false);
        bmd.ctx.stroke();
        first2=bmd.addToWorld()
        backgroundGroup.add(first2)
        
        bmd = game.add.bitmapData(game.world.width,game.world.height);
        bmd.ctx.translate(game.world.centerX-65, -50);
        bmd.ctx.beginPath();
        bmd.ctx.setLineDash([30]);
        bmd.ctx.strokeStyle = 'white'; 
        bmd.ctx.arc(65,65,350,0,100 * Math.PI,false);
        bmd.ctx.stroke();
        first3=bmd.addToWorld()
        backgroundGroup.add(first3)
        
        bmd = game.add.bitmapData(game.world.width,game.world.height);
        bmd.ctx.translate(game.world.centerX-65, -50);
        bmd.ctx.beginPath();
        bmd.ctx.setLineDash([30]);
        bmd.ctx.strokeStyle = 'white'; 
        bmd.ctx.arc(65,65,450,0,100 * Math.PI,false);
        bmd.ctx.stroke();
        first4=bmd.addToWorld()
        backgroundGroup.add(first4)
        
        bmd = game.add.bitmapData(game.world.width,game.world.height);
        bmd.ctx.translate(game.world.centerX-65, -50);
        bmd.ctx.beginPath();
        bmd.ctx.setLineDash([30]);
        bmd.ctx.strokeStyle = 'white'; 
        bmd.ctx.arc(65,65,550,0,100 * Math.PI,false);
        bmd.ctx.stroke();
        first5=bmd.addToWorld()
        backgroundGroup.add(first5)
        
        bmd = game.add.bitmapData(game.world.width,game.world.height);
        bmd.ctx.translate(game.world.centerX-65, -50);
        bmd.ctx.beginPath();
        bmd.ctx.setLineDash([30]);
        bmd.ctx.strokeStyle = 'white'; 
        bmd.ctx.arc(65,65,650,0,100 * Math.PI,false);
        bmd.ctx.stroke();
        first6=bmd.addToWorld()
        backgroundGroup.add(first6)
        
        bmd = game.add.bitmapData(game.world.width,game.world.height);
        bmd.ctx.translate(game.world.centerX-65, -50);
        bmd.ctx.beginPath();
        bmd.ctx.setLineDash([30]);
        bmd.ctx.strokeStyle = 'white'; 
        bmd.ctx.arc(65,65,750,0,100 * Math.PI,false);
        bmd.ctx.stroke();
        first7=bmd.addToWorld()
        backgroundGroup.add(first7)
        
        bmd = game.add.bitmapData(game.world.width,game.world.height);
        bmd.ctx.translate(game.world.centerX-65, -50);
        bmd.ctx.beginPath();
        bmd.ctx.setLineDash([30]);
        bmd.ctx.strokeStyle = 'white'; 
        bmd.ctx.arc(65,65,850,0,100 * Math.PI,false);
        bmd.ctx.stroke();
        first8=bmd.addToWorld()
        backgroundGroup.add(first8)
    }
    
    function normSpot(){
        
        planetToStop=1
        
        
        spotlight.x=planets[planetToStop].x;
        spotlight.y=planets[planetToStop].y;
        
        
        game.add.tween(spotlight).to({alpha:.2}, 400, Phaser.Easing.Cubic.In, true,150).yoyo(true).loop(true);
    
    }
    
    function randSpot(){
        
        planetToStop=game.rnd.integerInRange(1,8);
        while(planetToStop==planetAlready1 || planetToStop==planetAlready2 || planetToStop==planetAlready3 || planetToStop==planetAlready4 || planetToStop==planetAlready5 || planetToStop==planetAlready6 ||                           planetToStop==planetAlready7 || planetToStop==planetAlready8){
            planetToStop=game.rnd.integerInRange(1,8);
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
        particle.makeParticles('atlas.orbital',key);
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

				particle.makeParticles('atlas.orbital',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.orbital','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.orbital','smoke');
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
		name: "orbitalOrder",
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