
var soundsPath = "../../shared/minigames/sounds/"
//var spinePath = "../../galacticPool/images/spine/planetas/"
var galactic = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!",
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.galactic",
                json: "images/galactic/atlas.json",
                image: "images/galactic/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/galactic/atlastime.json",
                image: "images/galactic/atlastime.png",
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
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 97
	var indexGame
    var overlayGroup, planetsGroup, backgroundGroup, nebulas, correctedPos, textsGroup
    var spaceSong
    var dragablePlanets=new Array(8)
    var spinePlanets=new Array(8)
    var correctPositions=new Array(8)
    var releasedPlanet=new Array(8)
    var cantMovePlanet=new Array(8)
    var back
    var textsBackground=new Array(8)
    var nebul=new Array(8)
    var planetNames=['sun',"mercury","venus","earth","mars","jupiter","saturn","uranus","neptune"]
    var planetNamesES=['Sun',"Mercurio","Venus","Tierra","Marte","Júpiter","Saturno","Urano","Neptuno"]
    var planetNamesEN=['Sun',"Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"]
    var correctedNames=['dsun','dmercury','dvenus','dearth','dmars','djupiter','dsaturn','duranus','dneptune']
    var fontStyle2 = {font: "60px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
    var stick
    var scaleSpine = 0.55
    var heightBetweenPlanets
    var activateMovement
    var timetoHit
    var corrects
    var hitthePlanets
    var movementInX
    var starsInGame
    var stainsInGame
    var lastTween1, lastTween2, tweentiempo, tweenText
    var timeBar, clock, rect2, blocker
    var textsPlanets=new Array(8)
    var startTime, finalizeTime, dificulty, levels, dificultyInLevel
    var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#1B1464"
        lives = 1
        heightBetweenPlanets=70
        activateMovement=false
        timetoHit=0
        hitthePlanets=false
        movementInX=-60
        corrects=0
        startTime=false
        finalizeTime=false
        levels=1
        dificulty=100

        
        for (var initializedReleased=0; initializedReleased<9; initializedReleased++)
            {
            
                releasedPlanet[initializedReleased]=false
                cantMovePlanet[initializedReleased]=false
            
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.galactic','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.galactic','life_box')

        pivotX+= heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = heartImg.height * 0.15
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        //pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
    function stopGame(win){
        
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
        
        //Creamos las fisicas del proyecto
        
        game.physics.startSystem(Phaser.Physics.ARCADE)
		
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('spaceSong', soundsPath + 'songs/childrenbit.mp3');
        
		game.load.image('howTo',"images/galactic/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/galactic/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/galactic/introscreen.png")
        

       
        
        //cargo imagenes de draggable
        
        game.load.image('mrc',"images/galactic/mercury.png")
        
        //Aqui cargo las animaciones de los planetas
        
        
        game.load.spine('planets',"images/Spine/planetas/planets.json")
        
        // Aqui cargo el objeto de destino
        
        game.load.image('destiny',"images/galactic/destino.png")
        
        game.load.image('background',"images/galactic/fondo.png")
        
        //Aqui cargo el taco
        
        game.load.image('stick',"images/galactic/cue.png")
        
        
		
		    console.log(localization.getLanguage() + ' language')
           
        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
        sceneGroup.add(overlayGroup)
        
        
        
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        
        
        
        rect.events.onInputDown.add(function(){
            
            //bloqueo en el boton de audio
            
            blocker=planetsGroup.create(game.world.width-250,0, "mrc");
            blocker.alpha=0;
            
            
            
            //Entra el reloj y las letras con animacion
            
            game.add.tween(clock).to({alpha:1},500,Phaser.Easing.linear,true)
            game.add.tween(timeBar).to({alpha:1},500,Phaser.Easing.linear,true)
            
            
            //Cargar los planetas en una posicion inicial pero con animacion de entrada
                
                    for(var loadPlanets=1;loadPlanets<9;loadPlanets++)
                    {
                        
                        //Aqui coloco los destinos
                        
                       
                        
                        spinePlanets[loadPlanets] = game.add.spine(game.world.centerX+movementInX,game.world.height-heightBetweenPlanets-185, "planets");
                        spinePlanets[loadPlanets].scale.setTo(scaleSpine*1.9,scaleSpine*1.9)
                        spinePlanets[loadPlanets].setAnimationByName(0,"IDLE",true);
                        spinePlanets[loadPlanets].setSkinByName(planetNames[loadPlanets]);
                        spinePlanets[loadPlanets].tag=planetNames[loadPlanets]
                        planetsGroup.add(spinePlanets[loadPlanets])
                        
                        correctPositions[loadPlanets] = correctedPos.create(game.world.centerX+movementInX,game.world.height-heightBetweenPlanets-185, "destiny");
                        correctPositions[loadPlanets].scale.setTo(scaleSpine*2.5,scaleSpine*2.5)
                        correctPositions[loadPlanets].tag=correctedNames[loadPlanets]
                        correctPositions[loadPlanets].alpha=0
                        correctPositions[loadPlanets].anchor.setTo(0.5,0.5)
                        
                        
                        //Aqui coloco los textos que solo se manejaran con alpha
                        textsPlanets[loadPlanets]= new Phaser.Text(textsGroup.game, 0, 0, "0", fontStyle2)
                        textsPlanets[loadPlanets].x = spinePlanets[loadPlanets].x+50
                        textsPlanets[loadPlanets].y = spinePlanets[loadPlanets].y-35
                        textsPlanets[loadPlanets].alpha=0
                        game.add.tween(textsPlanets[loadPlanets]).to({alpha:1},500,Phaser.Easing.linear,true)
                        
                        if(localization.getLanguage()=="ES"){
                        textsPlanets[loadPlanets].setText(planetNamesES[loadPlanets])
                        }
                        if(localization.getLanguage()=="EN"){
                        textsPlanets[loadPlanets].setText(planetNamesEN[loadPlanets])
                        }
                        
                        textsGroup.add(textsPlanets[loadPlanets])
                        
                        
                        nebul[loadPlanets]=nebulas.create(0,0,'atlas.time','nebula')
                        nebul[loadPlanets].anchor.setTo(0.5,0.5)
                        nebul[loadPlanets].alpha=0
                        nebulas.add(nebul[loadPlanets])
                        
                        
                        movementInX+=60
                        if(movementInX>=120)
                            {
                                movementInX=-30
                            }
                        
                        dragablePlanets[loadPlanets]= planetsGroup.create(spinePlanets[loadPlanets].position.x,game.world.height-heightBetweenPlanets-185,"mrc");
                        dragablePlanets[loadPlanets].scale.setTo(scaleSpine*1,scaleSpine*1)
                        heightBetweenPlanets+=80
                        game.physics.enable(dragablePlanets[loadPlanets], Phaser.Physics.ARCADE)
                        
                        
                        
                        dragablePlanets[loadPlanets].body.collideWorldBounds = true;
                        dragablePlanets[loadPlanets].body.bounce.set(.9);
                        dragablePlanets[loadPlanets].tag=planetNames[loadPlanets]
                        dragablePlanets[loadPlanets].alpha=0
                        dragablePlanets[loadPlanets].anchor.setTo(.5,.5)
                        dragablePlanets[loadPlanets].events.onDragStop.add(onDragStop,dragablePlanets[loadPlanets]);
                        dragablePlanets[loadPlanets].events.onDragStart.add(onDragStart,dragablePlanets[loadPlanets]);
                        dragablePlanets[loadPlanets].events.onDragUpdate.add(onDragUpdate,dragablePlanets[loadPlanets]);
                    }
                    
                    
                    spinePlanets[0] = game.add.spine(game.world.centerX,game.world.height-150, "planets");
                    spinePlanets[0].scale.setTo(scaleSpine*2.5,scaleSpine*2.5)
                    spinePlanets[0].scale.setTo(scaleSpine*2.5,scaleSpine*2.5)
                    spinePlanets[0].setAnimationByName(0,"IDLE",true);
                    spinePlanets[0].setSkinByName(planetNames[0]);
                    spinePlanets[0].tag=planetNames[0]
                    planetsGroup.add(spinePlanets[0])
                    dragablePlanets[0]= planetsGroup.create(spinePlanets[0].position.x,spinePlanets[0].position.y,"mrc");
                    dragablePlanets[0].anchor.setTo(.5,.5)
                    dragablePlanets[0].scale.setTo(scaleSpine*2.5,scaleSpine*2.5)
                    game.physics.enable(dragablePlanets[0], Phaser.Physics.ARCADE)
                    dragablePlanets[0].alpha=0
            
            
                    //game.physics.enable(dragablePlanets[0], Phaser.Physics.ARCADE)
                    dragablePlanets[0].body.collideWorldBounds = true;
                    dragablePlanets[0].body.bounce.set(.9);
                    
                    //Tamaños a escala
            
                    spinePlanets[1].scale.setTo(scaleSpine*1.4,scaleSpine*1.4)
                    spinePlanets[2].scale.setTo(scaleSpine*1.6,scaleSpine*1.6)
                    spinePlanets[3].scale.setTo(scaleSpine*1.7,scaleSpine*1.7)
                    spinePlanets[4].scale.setTo(scaleSpine*1.5,scaleSpine*1.5)
                    spinePlanets[5].scale.setTo(scaleSpine*2.3,scaleSpine*2.3)
                    spinePlanets[6].scale.setTo(scaleSpine*2.25,scaleSpine*2.25)
                    spinePlanets[7].scale.setTo(scaleSpine*2,scaleSpine*2)
                    spinePlanets[8].scale.setTo(scaleSpine*2,scaleSpine*2)
            
                    correctPositions[1].scale.setTo(scaleSpine*1.4,scaleSpine*1.4)
                    correctPositions[2].scale.setTo(scaleSpine*1.6,scaleSpine*1.6)
                    correctPositions[3].scale.setTo(scaleSpine*1.7,scaleSpine*1.7)
                    correctPositions[4].scale.setTo(scaleSpine*1.5,scaleSpine*1.5)
                    correctPositions[5].scale.setTo(scaleSpine*2.3,scaleSpine*2.3)
                    correctPositions[6].scale.setTo(scaleSpine*2.25,scaleSpine*2.25)
                    correctPositions[7].scale.setTo(scaleSpine*2,scaleSpine*2)
                    correctPositions[8].scale.setTo(scaleSpine*2,scaleSpine*2)
            
                    rect2 = new Phaser.Graphics(game)
                    rect2.beginFill(0x000000)
                    rect2.drawRect(0,0,160, 80)
                    rect2.endFill()
                    planetsGroup.add(rect2)
            
                    rect2.alpha=0
                    
                    
                    game.physics.enable(rect2, Phaser.Physics.ARCADE)
        
        //Hacemos las fisicas
        
            game.physics.enable(stick, Phaser.Physics.ARCADE)
            game.physics.enable(blocker, Phaser.Physics.ARCADE)
            
            
            stick.body.immovable=true
            clock.body.immovable=true
            rect2.body.immovable=true
            blocker.body.immovable=true
            
            rect.inputEnabled = false
			sound.play("pop")
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height

                })
            
            //Pequeño delay
               game.add.tween(this).to({alpha:1},3000,Phaser.Easing.linear,true).onComplete.add(function(){
                        stick.body.velocity.setTo(0,80);    
                        hitthePlanets=true
                   for(var setTexts=1;setTexts<9;setTexts++)
                    {
                        game.add.tween(textsPlanets[setTexts]).to({alpha:0},500,Phaser.Easing.linear,true)
                    }
                })
            })
            
            
            
        
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.galactic','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
        
        clock= planetsGroup.create(game.world.centerX,50,'atlas.time','clock')
		clock.anchor.setTo(0.5,0.5)
		clock.scale.setTo(1,1)
        clock.alpha=0
        
        timeBar= planetsGroup.create(clock.centerX-171,clock.centerY+31,'atlas.time','bar')
		timeBar.anchor.setTo(1,1)
        timeBar.scale.setTo(-11.5,.7)
        timeBar.alpha=0
		
        game.physics.enable(clock, Phaser.Physics.ARCADE)
       
        
		var inputName = 'movil'
		
        
        
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.galactic',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.galactic','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
        
        correctedPos = game.add.group()
        backgroundGroup = game.add.group()
        nebulas = game.add.group()
        textsGroup = game.add.group()
        sceneGroup.add(backgroundGroup)
        planetsGroup =game.add.group()
        sceneGroup.add(correctedPos)
        sceneGroup.add(planetsGroup)
        sceneGroup.add(nebulas)
        sceneGroup.add(textsGroup)
        
        correctParticle = createPart("star")
        sceneGroup.add(correctParticle)
        wrongParticle = createPart("wrong")
        sceneGroup.add(wrongParticle)
        
        
        //Cargo el fondo que sea resizeble
        
        var backGr=game.add.tileSprite(0,0,game.world.width,game.world.height,"atlas.galactic",'stars')
        backgroundGroup.add(backGr)
        
        backgroundStains()
        
        //Cargo el palo como si fuera del fondo
        
        stick = planetsGroup.create(game.world.centerX-20,game.world.height-70,'stick')
	}
    
    
    function onDragStop(obj)
    {
       for(var checkDragStart=1;checkDragStart<9;checkDragStart++)
        {
        
        if(obj.tag==planetNames[checkDragStart])
            {
                releasedPlanet[checkDragStart-1]=true;
                textsPlanets[checkDragStart].alpha=0
            }
        }
        
    }
    
    function onDragUpdate(obj)
    {
        
        for(var checkDragStart=1;checkDragStart<9;checkDragStart++)
        {
        
        if(obj.tag==planetNames[checkDragStart] && hitthePlanets==true)
            {
                textsPlanets[checkDragStart].alpha=1
            }
        }
    }
    
    function onDragStart(obj)
    {
       
        
        for(var checkDragStart=1;checkDragStart<9;checkDragStart++)
        {
        
        if(obj.tag==planetNames[checkDragStart])
            {
                releasedPlanet[checkDragStart-1]=false;

            }
        }
        
    }
    
    
    //Division de luces
    function backgroundStains()
    {
        
        for(var randomStains=0; randomStains<5;randomStains++)
            {
                backgroundGroup.create(game.rnd.integerInRange(0,game.world.width) ,game.rnd.integerInRange(0,game.world.height),'atlas.galactic',"gradient1")
                backgroundGroup.create(game.rnd.integerInRange(0,game.world.width) ,game.rnd.integerInRange(0,game.world.height),'atlas.galactic',"gradient2")
                backgroundGroup.create(game.rnd.integerInRange(0,game.world.width) ,game.rnd.integerInRange(0,game.world.height),'atlas.galactic',"gradient3")
                backgroundGroup.create(game.rnd.integerInRange(0,game.world.width) ,game.rnd.integerInRange(0,game.world.height),'atlas.galactic',"gradient4")
            }
        
    }
    function reset()
    {
        
        // Primero ponemos todo en su lugar con un tweenque haga invisibles todas las cosas y luego las acomodo para luego hacerlas visibles, aqui tambien manejo la dificultad
        levels++
        if(levels%2==0 && dificulty>9)
            {
            dificulty--
            }
        corrects=0
        startTime=false
        finalizeTime=false
        for(var renew=0;renew<9;renew++)
            {
                releasedPlanet[renew]=false
                cantMovePlanet[renew]=false
            }
        activateMovement=false
        timetoHit=0
        hitthePlanets=false
        movementInX=-60
        heightBetweenPlanets=70
        stick.reset(game.world.centerX-20,game.world.height-70)
        dragablePlanets[0].reset(game.world.centerX,game.world.height-150)
        dragablePlanets[0].body.gravity.set(0, 0);
        spinePlanets[0].position.x=dragablePlanets[0].position.x
        spinePlanets[0].position.y=dragablePlanets[0].position.y
        
        
        
        for(var dissapearObjects=1;dissapearObjects<9;dissapearObjects++)
        {
            
            game.add.tween(spinePlanets[dissapearObjects]).to({alpha:0},500,Phaser.Easing.linear,true)
            game.add.tween(textsPlanets[dissapearObjects]).to({alpha:0},500,Phaser.Easing.linear,true)
            game.add.tween(correctPositions[dissapearObjects]).to({alpha:0},500,Phaser.Easing.linear,true)
            dragablePlanets[dissapearObjects].reset(correctPositions[dissapearObjects].x,correctPositions[dissapearObjects].position.y)
            spinePlanets[dissapearObjects].position.x=dragablePlanets[dissapearObjects].position.x
            spinePlanets[dissapearObjects].position.y=dragablePlanets[dissapearObjects].position.y
            nebul[dissapearObjects].alpha=0
            
            dragablePlanets[dissapearObjects].inputEnabled = false;
            dragablePlanets[dissapearObjects].input.enableDrag(false);
            dragablePlanets[dissapearObjects].body.gravity.set(0, 0);

        }
        
                        tweentiempo=game.add.tween(timeBar.scale).to({x:-11.5,y:.7}, 1000, Phaser.Easing.Linear.Out, true, 100);
        
                        tweentiempo.onComplete.add(function(){
        
                        lastTween1=game.add.tween(spinePlanets[0]).to({alpha:0},500,Phaser.Easing.linear,true)
            
        
        
                        lastTween1.onComplete.add(function(){
            
                        lastTween2=game.add.tween(spinePlanets[0]).to({alpha:1},1200,Phaser.Easing.linear,true)
            
            
                        for(var appearObjects=1;appearObjects<9;appearObjects++)
                        {
            
                                game.add.tween(spinePlanets[appearObjects]).to({alpha:1},1200,Phaser.Easing.linear,true)
                                game.add.tween(textsPlanets[appearObjects]).to({alpha:1},500,Phaser.Easing.linear,true)
                                lastTween2.onComplete.add(function(){
                                    
                                //Pequeño delay
                                    game.add.tween(this).to({alpha:1},3000,Phaser.Easing.linear,true).onComplete.add(function(){
                                    stick.body.velocity.setTo(0,80);    
                                    hitthePlanets=true
                                        //Desaparecen los textos
                                        for(var disappearTexts=1;disappearTexts<9;disappearTexts++)
                                        {
                                             textsPlanets[disappearTexts].alpha=0
                                        } 
                                    })
                                })
                        }
                })
             
         })   
    }
                                 
	
	function update(){
        
       
        game.physics.arcade.collide(stick,dragablePlanets[0])  
        
        sceneGroup.bringToTop(textsGroup);
        
        
        
        //Aqui corre el tiempo y se acomodan las nebulas
        
        if(startTime==false && timetoHit>1000)
            {
                for(var positionNebul=1; positionNebul<9; positionNebul++)
                    {
                        dificultyInLevel=game.rnd.integerInRange(1,dificulty)
                        if(dificultyInLevel<9)
                            {
                                nebul[dificultyInLevel].position.x=spinePlanets[dificultyInLevel].position.x
                                nebul[dificultyInLevel].position.y=spinePlanets[dificultyInLevel].position.y
                                nebul[dificultyInLevel].alpha=1
                            }
                    }
                
                
                tweentiempo=game.add.tween(timeBar.scale).to({x:0,y:.7}, 30000, Phaser.Easing.Linear.Out, true, 100);
                startTime=true
                tweentiempo.onComplete.add(function(){
                        
                        if(corrects==8)
                            {
                                reset();
                            }
                        else
                            {
                                sound.play("wrong")
                                hitthePlanets=false
                                for(var quickBlock2=1;quickBlock2<9;quickBlock2++)
                                {
                                dragablePlanets[quickBlock2].kill();
                                }
                                missPoint()
                            }
                    
                    })
                
            }
        
       
        if(hitthePlanets==true)
        {
            timetoHit++
        
        }
        if(timetoHit>20 && hitthePlanets==true)
        {
            stick.body.velocity.setTo(0,-100);
            
            
            if(checkOverlap(stick,dragablePlanets[0]))
            {
                dragablePlanets[0].body.velocity.setTo(game.rnd.integerInRange(400, -400),game.rnd.integerInRange(-1000, -1000));
                stick.position.x=0
                stick.position.y=-10
                stick.kill()
            }

            /////////////////////////////////////////
            //Aqui checo si esta encima de un destino
            for(var checkCorrect=1;checkCorrect<9;checkCorrect++){
                if(checkOverlap(correctPositions[checkCorrect],dragablePlanets[checkCorrect]) && releasedPlanet[checkCorrect-1]==true && cantMovePlanet[checkCorrect-1]==false)
                {
                    addPoint(1)
                    correctParticle.x = spinePlanets[checkCorrect].position.x
                    correctParticle.y = spinePlanets[checkCorrect].position.y
                    correctParticle.start(true, 1000, null, 5)
                    dragablePlanets[checkCorrect].kill();
                    spinePlanets[checkCorrect].position.x=correctPositions[checkCorrect].position.x
                    spinePlanets[checkCorrect].position.y=correctPositions[checkCorrect].position.y
                    textsPlanets[checkCorrect].position.x=spinePlanets[checkCorrect].position.x+50
                    textsPlanets[checkCorrect].position.y=spinePlanets[checkCorrect].position.y-35
                    textsPlanets[checkCorrect].alpha=1
                    cantMovePlanet[checkCorrect-1]=true
                    corrects++
                }
            }
            
            for(var checkWrong2=1; checkWrong2<9 ; checkWrong2++){
                for(var checkWrong1=1; checkWrong1<9 ; checkWrong1++){
                    if(checkOverlap(correctPositions[checkWrong1],dragablePlanets[checkWrong2]) && releasedPlanet[checkWrong2-1]==true && cantMovePlanet[checkWrong2-1]==false && checkWrong1!=checkWrong2)
                    {
                        hitthePlanets=false
                        sound.play("wrong")
                        spinePlanets[checkWrong2].alpha=0
                        dragablePlanets[checkWrong1].position.x=correctPositions[checkWrong1].position.x
                        dragablePlanets[checkWrong1].position.y=correctPositions[checkWrong1].position.y
                        textsPlanets[checkWrong1].position.x=correctPositions[checkWrong1].position.x+50
                        textsPlanets[checkWrong1].position.y=correctPositions[checkWrong1].position.y-35
                        for(var quickBlock=1;quickBlock<9;quickBlock++){
                            dragablePlanets[quickBlock].inputEnabled = false;
                            dragablePlanets[quickBlock].input.enableDrag(false);
                        }
                        textsPlanets[checkWrong1].alpha=1
                        wrongParticle.x = spinePlanets[checkWrong2].position.x
                        wrongParticle.y = spinePlanets[checkWrong2].position.y
                        wrongParticle.start(true, 1000, null, 5)
                        tweenText=game.add.tween(textsPlanets[checkWrong1]).to({alpha:1},1200,Phaser.Easing.linear,true)
                        tweenText.onComplete.add(function(){ 
                        //Pequeño delay
                        game.add.tween(this).to({alpha:1},1000,Phaser.Easing.linear,true).onComplete.add(function(){
                        missPoint()
                        })
                    })
                    break;
                }
            }
        }
            
             
            
            
            for(var planetsCrashing1=0;planetsCrashing1<9;planetsCrashing1++){
                for(var planetsCrashing2=0;planetsCrashing2<9;planetsCrashing2++){
                    
                    dragablePlanets[planetsCrashing1].body.gravity.set(game.rnd.integerInRange(400, -400), 0);
                    if(planetsCrashing1!=planetsCrashing2){
                        game.physics.arcade.collide(dragablePlanets[planetsCrashing1],dragablePlanets[planetsCrashing2])
                    }
                    
                }
                
                game.physics.arcade.collide(clock,dragablePlanets[planetsCrashing1])
                game.physics.arcade.collide(rect2,dragablePlanets[planetsCrashing1])
                game.physics.arcade.collide(blocker,dragablePlanets[planetsCrashing1])
            }
            
            for(var samePositions=1;samePositions<9;samePositions++)
            {
                if(cantMovePlanet[samePositions-1]==false){
            spinePlanets[samePositions].position.x=dragablePlanets[samePositions].position.x
            spinePlanets[samePositions].position.y=dragablePlanets[samePositions].position.y
            textsPlanets[samePositions].position.x=spinePlanets[samePositions].position.x+50
            textsPlanets[samePositions].position.y=spinePlanets[samePositions].position.y-35
                }
            }
            //unicamente sol
            spinePlanets[0].position.x=dragablePlanets[0].position.x
            spinePlanets[0].position.y=dragablePlanets[0].position.y
                
        }
        if(timetoHit>120)
        {
            stick.body.velocity.setTo(0,0);
        }
        
        
        if(timetoHit>1000)
        {
            
            for(var checkOverlapping1=1; checkOverlapping1<9 ; checkOverlapping1++){
                    
                    if(checkOverlap(correctPositions[checkOverlapping1],nebul[checkOverlapping1]))
                        {
                            nebul[checkOverlapping1].alpha=0
                            
                        }
                    if(checkOverlap(spinePlanets[checkOverlapping1],blocker))
                        {
                            dragablePlanets[checkOverlapping1].position.y+=100
                        }
             }
            
            
            for(var deactivePlanets=0; deactivePlanets<9;deactivePlanets++)
            {
                dragablePlanets[deactivePlanets].body.velocity.setTo(0,0);
            }
            activateMovement=true
            spinePlanets[0].alpha=0
            
            for(var appearPlanets=1;appearPlanets<9;appearPlanets++)
            {
                correctPositions[appearPlanets].alpha=1
                //Aqui los textos
            }
            for(var canDrag=1; canDrag<9;canDrag++)
            {
                dragablePlanets[canDrag].inputEnabled = true;
                //Esto hace que se puedan dragear
                dragablePlanets[canDrag].input.enableDrag(true);
            }
            
        
        }
        
        if(corrects==8 && finalizeTime==false)
            {
                finalizeTime=true
                tweentiempo.stop()
                tweentiempo=game.add.tween(timeBar.scale).to({x:0,y:.7}, 1000, Phaser.Easing.Linear.Out, true, 100);
                tweentiempo.onComplete.add(function(){
                        
                        if(corrects==8)
                            {
                                reset();
                            }
                    
                    })
                
                
            }
        
        
        
        
	}
	
    
    function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}
    
	function createTextPart(text,obj){
        
        var pointsText = lookParticle('text')
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            pointsText.setText(text)
            pointsText.scale.setTo(1,1)

            //game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            //game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            //deactivateParticle(pointsText,750)
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
        particle.makeParticles('atlas.galactic',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.2;
        particle.maxParticleScale = 0.5;
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

				particle.makeParticles('atlas.galactic',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.galactic','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.galactic','smoke');
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
		name: "galactic",
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